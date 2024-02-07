import * as dayjs from "dayjs";

import {
  DEFAULT,
  ROLES,
  TYPE_DAY_OBJ,
  TYPE_POINT_OBJ,
  TYPE_POST_OBJ,
} from "@/constants";
import { IEmployeeReport, IPoint, IRecord } from "@/models/report.model";
import { fullToHalf, parsePositiveRealNumber, trim } from "@/utils/string";

import useStore from "@/store";
import { isStringExistArrayElement } from "@/utils";
import { getTypeOfDay } from "@/utils/date";
import Decimal from "decimal.js";

export function useReport(data: IRecord[][]) {
  const iEmployeeReportList: IEmployeeReport[] = [];

  // 保存报表所在的日期
  const currentDate = data[0][0].date;

  const errorList: string[] = [];

  for (let item of data) {
    const obj: any = {};

    const { employeeName } = item[0];

    // 获取职工信息
    const employee = useStore().employee.list.find(
      (item) => item.employeeName === employeeName
    );
    if (!employee) continue;

    obj.employeeName = employeeName;
    obj.factor = employee.factor;

    const reportList = item.map((item2) => {
      const { record, date } = item2;
      const dayTypeId = getTypeOfDay(date);
      const pointList = parseRecord(employeeName, record, date, dayTypeId);
      const dailyOtherRatioPoint = getRatioPointByPostId(
        pointList,
        TYPE_POST_OBJ.OTHER.code
      );
      const dailyGastroscopyRatioPoint = getRatioPointByPostId(
        pointList,
        TYPE_POST_OBJ.GASTROSCOPY.code
      );
      const annual =
        pointList.find(
          (p) => p.typeId === TYPE_POINT_OBJ.REST.ANNUAL_LEAVE.code
        )?.point ?? 0;

      const marriage =
        pointList.find(
          (p) => p.typeId === TYPE_POINT_OBJ.REST.MARRIAGE_LEAVE.code
        )?.point ?? 0;

      return {
        employeeName,
        factor: employee?.factor ?? "0",
        date: item2.date,
        typeId: dayTypeId,
        pointList,
        dailyOtherRatioPoint,
        dailyGastroscopyRatioPoint,
        annual,
        marriage,
        isWork: dailyOtherRatioPoint > 0 || dailyGastroscopyRatioPoint > 0,
      };
    });

    const totalOtherRatioPoint = reportList
      .reduce((a, b) => a.plus(b.dailyOtherRatioPoint), new Decimal(0))
      .toNumber();
    obj.totalOtherRatioPoint = totalOtherRatioPoint;

    const totalGastroscopyRatioPoint = reportList
      .reduce((a, b) => a.plus(b.dailyGastroscopyRatioPoint), new Decimal(0))
      .toNumber();
    obj.totalGastroscopyRatioPoint = totalGastroscopyRatioPoint;

    // 年假
    obj.annual = reportList
      .reduce((a, b) => a.plus(b.annual), new Decimal(0))
      .toNumber();

    // 婚假
    obj.marriage = reportList
      .reduce((a, b) => a.plus(b.marriage), new Decimal(0))
      .toNumber();

    // 出勤总天数
    const attendanceList = reportList.filter((e) => e.isWork);
    obj.attendanceCount = attendanceList.length;

    // 工作日总天数
    obj.workdayCount = attendanceList.filter((e) =>
      [TYPE_DAY_OBJ.WEEKDAY.code, TYPE_DAY_OBJ.MAKEUP.code].includes(e.typeId)
    ).length;

    // 时间总工分=其他岗位总工分+胃2岗位总工分*1.2
    obj.totalTimeRatioPoint = new Decimal(totalOtherRatioPoint)
      .plus(new Decimal(totalGastroscopyRatioPoint).times(1.2))
      .toNumber();

    // 护士长固定2天科务
    const roleId = employee.postId;
    obj.serve = roleId === ROLES[1].code ? 2 : 0;

    iEmployeeReportList.push(obj);
  }

  /**
   * 解析工作记录字符串
   * @param {string} record 当日填写的工作记录
   * @returns {IPoint[]} 工分详细列表
   */
  function parseRecord(
    employeeName: string,
    record: string,
    date: string,
    dayTypeId: string
  ): IPoint[] {
    // 去掉空格，大写转小写
    const nRecord = trim(fullToHalf(record));

    // 纯文字的记录：各种休
    if(!/\d/.test(nRecord)){
      // 获取休日信息
      const point = getRestInfoByText(nRecord);
      if(!point){
        errorList.push(`${employeeName}：${date} 的工分记录：${nRecord} 填写错误，无法解析，请核对！！！`);
        return [];
      }
      return [point];
    }else{
      // 按'/'分成不同的种类进行解析
      const parts = nRecord.split("/");

    }



    if () {
      const parts = nRecord.split("/");
      const iPointList: IPoint[][] = [];
      parts.forEach((part) => {
        const p = parsePart(part, employeeName, date, dayTypeId);
        if (p) {
          iPointList.push(p);
        } else {
          errorList.push(`${employeeName}：${date} 的工分记录：${nRecord} 填写错误，无法解析，请核对！！！`);
        }
      });
      return iPointList.flat();
    } else {
      // 休，年休等
      let point = {
        typeId: "unknown",
        typeName: "未知",
        point: 1,
      };
      for (let item of Object.values(TYPE_POINT_OBJ.REST)) {
        if (item.text.includes(nRecord)) {
          point = {
            typeId: item.code,
            typeName: item.text[0],
            point: 1,
          };
          break;
        }
      }
      return [point];
    }
  }

  /**
   * 解析工作记录部分字符串
   * @param {string} part 当日填写的工作记录
   * @returns {IPoint[]} 工分详细列表
   */
  function parsePart(
    part: string,
    employeeName: string,
    date: string,
    isWeekendOrHolidayOvertime: boolean
  ): IPoint[] | undefined {
    // 胃镜
    const prefixes = ['胃', '胃镜'];
    const regexStr = `^(${prefixes.join('|')})\\d+(\\.\\d+)?(\\+\\d+(\\.\\d+)?)?$`;
    const regex = new RegExp(regexStr);

    // 手术
    const prefixes2 = ['手']; // 定义可能的开头字符串
const prefixRegex2 = prefixes.length > 0 ? `(${prefixes.join('|')})?` : ''; // 生成前缀正则表达式部分
const regexStr2 = `^${prefixRegex2}\\d+(\.\d+)?(\+\d+(\.\d+)?)?$`; // 拼接生成完整正则表达式
const regex2 = new RegExp(regexStr);
  //   if(part.indexOf('+') === -1){
  //     // 纯数字
  //     if(isNumeric(part)){
  //       return [
  //         {
  //           typeId: string; // 类别
  // typeName: string; // 类别
  // postId?: string; // 岗位id
  // postName?: string; // 岗位名称
  // point: number; // 岗位工分（小时）
  // pointRatio?: number; // 岗位工分倍率
  // ratioPoint?: number; // 岗位工分 * 岗位工分倍率
  //         }
  //       ]
  //     }
  //   }



    // 异常1: xx+胃 的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.GASTROSCOPY.text) &&
      TYPE_POST_OBJ.GASTROSCOPY.text
        .map((e) => part.indexOf(e))
        .filter((e) => e > 0).length > 0
    ) {
      return undefined;
    }

    // 异常2: xx+手 的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.OTHER.text) &&
      TYPE_POST_OBJ.OTHER.text.map((e) => part.indexOf(e)).filter((e) => e > 0)
        .length > 0
    ) {
      return undefined;
    }

    // 异常3: 手7.5胃1.5的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.GASTROSCOPY.text) &&
      isStringExistArrayElement(part, TYPE_POST_OBJ.OTHER.text)
    ) {
      return undefined;
    }

    // 0.x年假 / 0.x婚嫁的时候
    const annual = TYPE_POINT_OBJ.REST.ANNUAL_LEAVE;
    const marriage = TYPE_POINT_OBJ.REST.MARRIAGE_LEAVE;

    if (isStringExistArrayElement(part, annual.text)) {
      return [
        {
          typeId: annual.code,
          typeName: annual.text[0],
          point: parsePositiveRealNumber(part),
        },
      ];
    } else if (isStringExistArrayElement(part, [marriage.text])) {
      return [
        {
          typeId: marriage.code,
          typeName: marriage.text,
          point: parsePositiveRealNumber(part),
        },
      ];
    } else {
      // 胃镜的场合
      const detail = part.split("+").map((el) => parsePositiveRealNumber(el));
      const pointList: any[] = [];
      for (let i = 0; i < detail.length; i++) {
        // 无法解析的时候
        if (i > 1) {
          const error = `${employeeName}：${date} 的工分记录：${part} 填写错误，无法解析，请核对！！！`;
          // 防止重复添加
          if (errorList.indexOf(error) === -1) {
            errorList.push(error);
          }
          continue;
        }

        // 工分
        const point = detail[i];

        // 岗位
        const post = isStringExistArrayElement(
          part,
          TYPE_POST_OBJ.GASTROSCOPY.text
        )
          ? TYPE_POST_OBJ.GASTROSCOPY
          : TYPE_POST_OBJ.OTHER;

        // 上班 or 加班
        const type = isWeekendOrHolidayOvertime
          ? TYPE_POINT_OBJ.ATTENDANCE.OVERTIME
          : Object.values(TYPE_POINT_OBJ.ATTENDANCE)[i];

        const pointRatio = getPointRatio(
          date,
          post.code,
          type.code,
          employeeName
        );

        pointList.push({
          typeId: type.code,
          typeName: type.text,
          postId: post.code,
          postName: post.text[0],
          point,
          pointRatio,
          ratioPoint: new Decimal(point).times(pointRatio).toNumber(),
        });
      }
      return pointList;
    }
  }

  /**
   * 根据岗位id获取当天工分
   * @param {any[]} pointList 当日填写的工作记录
   * @returns {number} 当日岗位总工分
   */
  function getRatioPointByPostId(pointList: any[], postId: string): number {
    return pointList
      .filter((p) => p.postId === postId)
      .reduce((a, b) => a.plus(b.ratioPoint), new Decimal(0))
      .toNumber();
  }

  function getPointRatio(
    date: string,
    postId: string,
    statusId: string,
    name: string
  ): number {
    // 1.特殊岗位工分倍率设定（优先级最高）
    const rateSettingList = useStore().dayRatioSetting.list;

    const rateSetting = rateSettingList.find(
      (el) =>
        el.date === date && // 日期
        el.postId === postId && // 岗位
        el.statusId === statusId && // 加班
        el.employeeId === name // 姓名
    );

    if (rateSetting) {
      return rateSetting.rate;
    }

    // 2.节假日
    const holiday = useStore().holiday.holidayList.find((e) => e.date === date);

    // 节假日加班，全部按加班倍率计算
    if (holiday && holiday.typeId === "1") {
      return holiday.extraWeight;
    }

    // 节假日补班，按上班加班倍率分别计算
    if (holiday && holiday.typeId === "0") {
      return statusId === "0" ? holiday.workWeight : holiday.extraWeight;
    }

    // 3.周末
    const dayOfWeek = dayjs(date).day(); // 获取日期的星期几
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return DEFAULT.RATIO.OVERTIME;
    }

    // 4.工作日
    return statusId === "0" ? DEFAULT.RATIO.WORK : DEFAULT.RATIO.OVERTIME;
  }



  const getRestInfoByText = (text: string): IPoint | null=> {
    for (let item of Object.values(TYPE_POINT_OBJ.REST)) {
      if (item.text.includes(text)) {
        return {
          typeId: item.code,
          typeName: item.text[0],
          point: 1,
        };
      }
    }
    return null;
  }

  const isGastroscopyPart = (target:string) => {
        // 胃镜
        const prefixes = ['胃', '胃镜'];
        const regexStr = `^(${prefixes.join('|')})\\d+(\\.\\d+)?(\\+\\d+(\\.\\d+)?)?$`;
        const regex = new RegExp(regexStr);
        return regex.test(target)
  }

  const isOperationPart = (target:string) => {
    const prefixes = ['手']; // 定义可能的开头字符串
    const prefixRegex = prefixes.length > 0 ? `(${prefixes.join('|')})?` : ''; // 生成前缀正则表达式部分
    const regexStr = `^${prefixRegex}\\d+(\.\d+)?(\+\d+(\.\d+)?)?$`; // 拼接生成完整正则表达式
    const regex = new RegExp(regexStr);
    return regex.test(target)
}

  return {
    iEmployeeReportList,
    currentDate,
    errorList,
  };
}
