import {
  DEFAULT_OVERTIME_RATIO,
  DEFAULT_WORK_RATIO,
  HOLIDAY_TYPE,
  JOB_INFO,
  POST_INFO,
  REST_INFO,
  WORK_TYPE_INFO,
} from "@/constants";
import { Record, Report } from "@/types/report";

import useStore from "@/store";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Decimal from "decimal.js";

dayjs.extend(isBetween);

interface Point {
  typeId: string; // 类别id 上班，加班，休假
  typeName: string; // 类别名称 上班，加班，休假
  jobId?: string; // 岗位id
  jobName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  ratio?: number; // 岗位工分倍率
  ratioPoint?: number; // 岗位工分 * 岗位工分倍率
  date: string;
}

interface RatioInfo {
  ratio: number;
  type: {
    label: string;
    id: string;
  };
}

export async function useReport(data: Record[][]) {
  const reports: Report[] = [];
  // 保存报表所在的日期
  let currentDate = data[0][0].date;
  // 异常记录
  const errors: string[] = [];

  // 职工列表
  const employeeList = await useStore().employee2.getEmployeeTempList();

  for (let item of data) {
    const employee = employeeList.find(
      (el) => el.name === item[0].employeeName
    );

    let workDayCount = 0;
    let workCount = 0;

    if (employee) {
      let pointList: Point[] = [];
      let hasError: boolean = false;
      for (let e of item) {
        const { record, date } = e;
        // 1.纯文字的记录：各种休
        if (!/\d/.test(record)) {
          // 获取休日信息
          const p = getRestInfoByText(record, date);
          if (!p) {
            hasError = true;
          } else {
            pointList.push(p);
          }
        } else {
          // 当日是否为工作日或节假日补班
          const ratioObj = await getRatio(date);

          const typeid = Object.values(ratioObj)[0].map((e) => e.type.id)[0];

          if (
            [WORK_TYPE_INFO.MAKEUP.id, WORK_TYPE_INFO.WEEKDAY.id].includes(
              typeid
            )
          ) {
            workDayCount += 1;
          }
          workCount += 1;

          const iPoints = parseRecord(record, ratioObj, date);

          if (iPoints.length === 0) {
            hasError = true;
          } else {
            pointList.push(...iPoints);
          }
        }

        if (hasError) {
          errors.push(
            `${employee.name}：在${date} 填写的工分记录：${record} 填写错误，无法解析，请核对！！！`
          );
          hasError = false;
        }
      }
      pointList.sort((a,b) => {
        return dayjs(a.date).unix() - dayjs(b.date).unix();
      })
      console.log("%c Line:90 🥝 pointList", "color:#3f7cff", pointList.map(el => {
        return {
          date: el.date,
          typeName: el.typeName,
          jobName: el.jobName,
          point: el.point,
          ratio: el.ratio,
          ratioPoint: el.ratioPoint
        }
      }));


      let annual = new Decimal(0);
      let leave = 0;
      let totalWorkOther = new Decimal(0);
      let totalWorkGastroscopy = new Decimal(0);
      let totalOvertimeOther = new Decimal(0);
      let totalOvertimeGastroscopy = new Decimal(0);
      pointList.forEach((el) => {
        const { typeId, ratioPoint = 0 } = el;
        if (typeId === REST_INFO.ANNUAL_LEAVE.id) {
          annual = annual.plus(el.point);
        } else if (typeId === REST_INFO.LEAVE.id) {
          leave += 1;
        } else {
          // 工作日上班 & 工作日（补）上班
          if (
            [WORK_TYPE_INFO.WEEKDAY.id, WORK_TYPE_INFO.MAKEUP.id].includes(
              typeId
            )
          ) {
            // 其他岗位
            if (el.jobId === JOB_INFO.OTHER.id) {
              totalWorkOther = totalWorkOther.plus(ratioPoint);
            } else if (el.jobId === JOB_INFO.GASTROSCOPY.id) {
              totalWorkGastroscopy = totalWorkGastroscopy.plus(ratioPoint);
            }
          } else {
            // 加班
            // 其他岗位
            if (el.jobId === JOB_INFO.OTHER.id) {
              totalOvertimeOther = totalOvertimeOther.plus(ratioPoint);
            } else if (el.jobId === JOB_INFO.GASTROSCOPY.id) {
              totalOvertimeGastroscopy =
                totalOvertimeGastroscopy.plus(ratioPoint);
            }
          }
        }
      });

      const totalOther = totalWorkOther.plus(totalOvertimeOther);
      const totalGastroscopy = totalWorkGastroscopy.plus(
        totalOvertimeGastroscopy
      );
      const iReport: Report = {
        employeeName: employee.name,
        factor: employee.factor,
        annual: annual.toNumber(),
        leave,
        workDayCount,
        workCount,
        totalWorkOther: totalWorkOther.toNumber(),
        totalWorkGastroscopy: totalWorkGastroscopy.toNumber(),
        totalOvertimeOther: totalOvertimeOther.toNumber(),
        totalOvertimeGastroscopy: totalOvertimeGastroscopy.toNumber(),
        totalOther: totalOther.toNumber(),
        totalGastroscopy: totalGastroscopy.toNumber(),
        total: totalOther.plus(totalGastroscopy.times(1.2)).toNumber(),
        serve: employee.positionId === POST_INFO.HEAD_NURSE.id ? 2 : 0,
      };
      reports.push(iReport);
    }
  }

  return {
    reports,
    currentDate,
    errors,
  };
}

/**
 * 根据休日文字获取信息
 * @param {string} text
 * @returns {Point | null}
 */
const getRestInfoByText = (text: string, date: string): Point | null => {
  for (let item of Object.values(REST_INFO)) {
    if (item.label.includes(text)) {
      return {
        typeId: item.id,
        typeName: item.label[0],
        point: 1,
        date
      };
    }
  }
  return null;
};
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

/**
 * 检测是否为手术公分记录
 * @param target
 * @returns {boolean}
 */
const isAnnualPart = (target: string) => {
  const prefixes: string[] = REST_INFO.ANNUAL_LEAVE.label; // 定义可能的开头字符串
  const regexStr = `^(半天|0\\.5)(${prefixes.join("|")})$`;
  const regex = new RegExp(regexStr);
  return regex.test(target);
};

/**
 * 获取倍率
 * @param {string} date 日期
 * @param {string} jobId 岗位id
 * @param {string} employeeId 员工id
 * @returns {{[k: string]: RatioInfo[]}}
 */
const getRatio = async (date: string) => {
  let res: {
    [k: string]: RatioInfo[];
  } = {};

  // 节假日列表
  const holidayList = await useStore().holiday2.getHolidayTempList();
  const holiday = holidayList.find((el) =>
    dayjs(date).isBetween(el.dateStart, el.dateEnd, null, "[]")
  );

  if (holiday) {
    let workRatio = +holiday.ratio2;
    const extraRatio = +holiday.ratio2;
    const workType =
      holiday.type === HOLIDAY_TYPE.MAKEUP
        ? WORK_TYPE_INFO.MAKEUP
        : WORK_TYPE_INFO.HOLIDAY;

    if(workType.id === WORK_TYPE_INFO.MAKEUP.id){
      workRatio = holiday.ratio1;
    }
    const overtimeType =
      holiday.type === HOLIDAY_TYPE.MAKEUP
        ? WORK_TYPE_INFO.MAKEUP_OVERTIME
        : WORK_TYPE_INFO.HOLIDAY;

    res = getWorkDetails(workRatio, extraRatio, workType, overtimeType);
  } else {
    const dayOfWeek = dayjs(date).day();
    if ([0, 6].includes(dayOfWeek)) {
      res = getWorkDetails(
        DEFAULT_OVERTIME_RATIO,
        DEFAULT_OVERTIME_RATIO,
        WORK_TYPE_INFO.WEEKEND_OVERTIME,
        WORK_TYPE_INFO.WEEKEND_OVERTIME
      );
    } else {
      res = getWorkDetails(
        DEFAULT_WORK_RATIO,
        DEFAULT_OVERTIME_RATIO,
        WORK_TYPE_INFO.WEEKDAY,
        WORK_TYPE_INFO.WEEKDAY_OVERTIME
      );
    }
  }
  return res;
};

const getWorkDetails = (
  workRatio: number,
  extraRatio: number,
  workType: {
    id: string;
    label: string;
  },
  overtimeType: {
    id: string;
    label: string;
  }
) => {
  const jobIds = Object.values(JOB_INFO).map((e) => e.id);

  return jobIds.reduce((acc: any, jobId) => {
    acc[jobId] = [
      {
        ratio: workRatio,
        type: workType,
      },
      {
        ratio: extraRatio,
        type: overtimeType,
      },
    ];
    return acc;
  }, {});
};

const getJobNameById = (id: string) => {
  return getLabelById(id, JOB_INFO);
};

const getLabelById = (id: string, obj: Object) => {
  return Object.values(obj).find((e) => e.id === id)?.label[0] ?? "not found";
};

/**
 * 解析工作记录字符串
 * @param {string} record 工分记录
 * @param {{ [k: string]: RatioInfo[] }} ratioObj 工分倍率信息
 * @returns {Point[]} 工分详细列表
 */
const parseRecord = (
  record: string,
  ratioObj: { [k: string]: RatioInfo[] },
  date: string
): Point[] => {
  // 2.按'/'分成不同的种类进行解析
  const parts = record.split("/");
  if (parts.length > 2) {
    return [];
  } else {
    const res: Point[][] = [];
    for (let part of parts) {
      const iPoints = parsePart(part, ratioObj, date);
      if (iPoints.length > 0) {
        res.push(iPoints);
      } else {
        return [];
      }
    }
    if (res.some((e) => e.length === 0)) {
      return [];
    } else {
      return res.flat();
    }
  }
};

/**
 * 解析岗位工分记录字符串
 * @param {string} part 岗位工分记录
 * @param {{ [k: string]: RatioInfo[] }} ratioObj 岗位工分记录
 * @returns {Point[]} 工分详细列表
 */
const parsePart = (
  part: string,
  ratioObj: { [k: string]: RatioInfo[] },
  date: string 
): Point[] => {
  // 确定岗位
  let job = JOB_INFO.OTHER;

  if (isGastroscopyPostPart(part)) {
    job = JOB_INFO.GASTROSCOPY;
  } else if (isOtherPostPart(part)) {
    job = JOB_INFO.OTHER;
  } else if (isAnnualPart(part)) {
    const { id, label } = REST_INFO.ANNUAL_LEAVE;
    return [
      {
        typeId: id,
        typeName: label[0],
        point: 0.5,
        date
      },
    ];
  } else {
    return [];
  }

  const jobId = job.id;

  return part.split("+").map((e, i) => {
    const point = +e.replace(/[\u4e00-\u9fa5]/g, "");
    const { ratio, type } = ratioObj[jobId][i];
    const ratioPoint = new Decimal(point).times(ratio).toNumber();
    return {
      point,
      ratio,
      ratioPoint,
      jobId,
      jobName: getJobNameById(jobId),
      typeId: type.id, // 0 上班，1：加班
      typeName: type.label, // 0 上班，1：加班,
      date
    };
  });
};
