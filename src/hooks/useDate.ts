import { DAY_TYPE, DEFAULT_RATIO, JOB_INFO } from "@/constants";
import useStore from "@/store";
import { Record } from "@/types/report";
import { getMonthWeeksList } from "@/utils/date";
import dayjs from "dayjs";

export interface RecordInfo {
  ss: number;
  ssj: number;
  wj: number;
  wjj: number;
  employeeId: string;
  employeeName: string;
  date: string;
  record: string;
  weekDay: number; // 星期
  name: string; // 节假日名称，工作日，周末
  type: string;
  typeName: string; // 放假，补班，工作日上班，周末加班
  ratio1: number; // 上班工分倍率
  ratio2: number; // 加班工分倍率
}

export default async function useDate(
  yearMonth: string,
  weekNo: number,
  data: Record[][]
) {
  /**
   * 检测是否为胃镜公分记录
   * @param target
   * @returns {boolean}
   */
  const isGastroscopyPostPart = (target: string) => {
    // 胃镜
    const prefixes: string[] = JOB_INFO.GASTROSCOPY.label;
    const regexStr = `^(${prefixes.join(
      "|"
    )})\\d+(\\.\\d+)?(\\+\\d+(\\.\\d+)?)?$`;
    const regex = new RegExp(regexStr);
    return regex.test(target);
  };

  /**
   * 检测是否为手术公分记录
   * @param target
   * @returns {boolean}
   */
  const isOtherPostPart = (target: string) => {
    const prefixes: string[] = JOB_INFO.OTHER.label; // 定义可能的开头字符串
    const regexStr = `^(${prefixes.join(
      "|"
    )})?\\d+(\\.\\d+)?(\\+\\d+(\\.\\d+)?)?$`;
    const regex = new RegExp(regexStr);
    return regex.test(target);
  };

  const getNumberFromString = (str: string): number => {
    return +str.replace(/[\u4e00-\u9fa5]/g, "");
  };

  // 保存报表所在的日期
  const currentDate = data[0][0].date;

  // 职工列表
  const employeeList = await useStore().employee2.getEmployeeTempList(
    currentDate
  );

  // 节假日列表
  const holidayList = await useStore().holiday2.getHolidayTempList();

  // 所有职员的信息
  const resList: RecordInfo[] = [];

  for (let recordList of data) {
    // 获取职工信息
    const employee = employeeList.find(
      (el) => el.name === recordList[0].employeeName
    );

    // 没有找到该职工，跳过
    if (!employee) {
      continue;
    }

    for (let item of recordList) {
      // 获取日期和工分
      const { date, record } = item;
      // 获取该日是星期几 (6=周日, 0=周一, ..., 5=周六)
      const weekDay = dayjs(date).day() === 0 ? 6 : dayjs(date).day() - 1;
      const extraInfo = {
        employeeId: employee.id,
        employeeName: employee.name,
        date,
        record,
        weekDay, // 星期
        name: "", // 节假日名称，工作日，周末
        type: "",
        typeName: "", // 放假，补班，工作日上班，周末加班
        ratio1: 0, // 上班工分倍率
        ratio2: 0, // 加班工分倍率
      };
      // 获取当日是否为工作日或节假日
      const holiday = holidayList.find((el) =>
        dayjs(date).isBetween(el.dateStart, el.dateEnd, null, "[]")
      );

      // 日期不在节假日列表中，为工作日
      if (!holiday) {
        if (weekDay < 5) {
          // 工作日
          extraInfo.ratio1 = DEFAULT_RATIO.WORK;
          extraInfo.name = "工作日";
          extraInfo.type = DAY_TYPE.WEEKDAY;
          extraInfo.typeName = "工作日上班";
        } else {
          // 周末
          extraInfo.ratio1 = DEFAULT_RATIO.OVERTIME;
          extraInfo.name = "周末";
          extraInfo.type = DAY_TYPE.WEEKEND;
          extraInfo.typeName = "周末加班";
        }
        extraInfo.ratio2 = DEFAULT_RATIO.OVERTIME;
      } else {
        extraInfo.ratio1 = holiday.ratio1;
        extraInfo.ratio2 = holiday.ratio2;
        extraInfo.name = holiday.name;
        extraInfo.type = holiday.type;
        extraInfo.typeName = holiday.typeName;
      }

      // 纯文字的工分
      if (!/\d/.test(record)) {
        resList.push({
          ss: 0,
          ssj: 0,
          wj: 0,
          wjj: 0,
          ...extraInfo,
        });
      } else {
        // 按'/'分成不同的种类进行解析
        if (record.indexOf("/") < 0) {
          // 只有一种类型工分
          if (isGastroscopyPostPart(record)) {
            let [wj, wjj] = [0, 0];
            if (record.indexOf("+") < 0) {
              wj = getNumberFromString(record);
            } else {
              [wj, wjj] = record.split("+").map((e) => getNumberFromString(e));
            }
            resList.push({
              ss: 0,
              ssj: 0,
              wj,
              wjj,
              ...extraInfo,
            });
          } else if (isOtherPostPart(record)) {
            let [ss, ssj] = [0, 0];
            if (record.indexOf("+") < 0) {
              ss = getNumberFromString(record);
            } else {
              [ss, ssj] = record.split("+").map((e) => getNumberFromString(e));
            }
            resList.push({
              ss,
              ssj,
              wj: 0,
              wjj: 0,
              ...extraInfo,
            });
          }
        } else {
          let [ss, ssj, wj, wjj] = [0, 0, 0, 0];
          const parts = record.split("/");
          for (let part of parts) {
            if (isGastroscopyPostPart(part)) {
              if (part.indexOf("+") < 0) {
                wj = getNumberFromString(part);
              } else {
                [wj, wjj] = part.split("+").map((e) => getNumberFromString(e));
              }
            } else if (isOtherPostPart(part)) {
              if (part.indexOf("+") < 0) {
                ss = getNumberFromString(part);
              } else {
                [ss, ssj] = part.split("+").map((e) => getNumberFromString(e));
              }
            }
          }
          resList.push({
            ss,
            ssj,
            wj,
            wjj,
            ...extraInfo,
          });
        }
      }
    }
  }
  console.log("%c Line:191 🍿 resList", "color:#465975", resList);

  const weeksList: string[][] = getMonthWeeksList(yearMonth);
  console.log("weeksList: " + weeksList);

  // 获取年、月
  const [year, month] = yearMonth.split("/").map((e) => +e);

  // 获取该月的第一天
  const firstDayOfMonth = dayjs(`${year}-${month}-01`);

  // 获取该日是星期几 (0=周日, 1=周一, ..., 6=周六)
  const firstDayWeekday = firstDayOfMonth.day();

  // 计算偏移量，让一周从周一开始排列，0表示周日，转为6
  const offset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const weeks: string[] = [];

  if (weekNo === 1 && offset > 0) {
    for (let i = 0; i < offset; i++) {
      weeks.push("");
    }
    for (let i = 0; i < 7 - offset; i++) {
      const date = firstDayOfMonth.add(i, "day");
      const dayMonth = date.month() + 1;
      const formatDate = date.format("YYYY-MM-DD");
      if (dayMonth === month) {
        weeks.push(formatDate);
      } else {
        weeks.push("");
      }
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const date = firstDayOfMonth.add(i, "day");
      const dayMonth = date.month() + 1;
      const formatDate = date.format("YYYY-MM-DD");
      if (dayMonth === month) {
        weeks.push(formatDate);
      } else {
        weeks.push("");
      }
    }
  }
  const verificationList: any = {};
  const filterList = resList.filter((item: any) => weeks.includes(item.date));
  employeeList.forEach((emp) => {
    const employeeRecords = weeks.map((date: string, index: number) => {
      if (date.length > 0) {
        const data = filterList.find(
          (item) => item.date === date && item.employeeId === emp.id
        );
        if (data) {
          return data;
        } else {
          return {
            ss: 0,
            ssj: 0,
            wj: 0,
            wjj: 0,
            employeeId: emp.id,
            employeeName: emp.name,
            date,
            record: "",
            weekDay: index,
            name: "",
            type: "",
            typeName: "",
            ratio1: 0,
            ratio2: 0,
          };
        }
      } else {
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          date,
          record: "",
          ss: 0,
          ssj: 0,
          wj: 0,
          wjj: 0,
          weekDay: index,
          name: "",
          type: "",
          typeName: "",
          ratio1: 0,
          ratio2: 0,
        };
      }
    });
    verificationList[emp.name] = employeeRecords;
    console.log("verificationList: " + verificationList);
  });
  return {
    verificationList,
  };
}
