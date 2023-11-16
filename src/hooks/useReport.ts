import { IDailyRecord, IEmployeeReport, IPoint } from "@/models/report.model";
import {
  ROLES,
  TYPE_DAY_OBJ,
  TYPE_POINT_OBJ,
  TYPE_POST_OBJ,
} from "@/constants";
import {
  fullWidthToHalfWidth,
  parsePositiveRealNumber,
  removeSpaces,
} from "@/utils/string";

import Decimal from "decimal.js";
import { getTypeAndRatioOfDay } from "@/utils/date";
import { isStringExistArrayElement } from "@/utils";
import useStore from "@/store";

export function useReport(data: IDailyRecord[][]) {
  const iEmployeeReportList: IEmployeeReport[] = [];

  // 保存报表所在的日期
  const currentDate = data[0][0].date;

  const errorList:string[] = [];

  data.forEach((item) => {
    const obj: any = {};

    const { employeeName } = item[0];
    obj.employeeName = employeeName;

    // 获取职工信息
    const employee = useStore().employee.employeeList.find(
      (el2) => el2.name === employeeName
      );
    obj.factor = employee?.factor ?? "0";
    const roleId = employee?.roleId ?? ROLES[0].code;

    const reportList = item.map((item2) => {
      const { record, date } = item2;
      const { code, text, ratio } = getTypeAndRatioOfDay(date);
      const pointList = parseRecord(employeeName, record, ratio, date, code);
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
        typeId: code,
        typeName: text,
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

    obj.annual = reportList
      .reduce((a, b) => a.plus(b.annual), new Decimal(0))
      .toNumber();

    obj.marriage = reportList
      .reduce((a, b) => a.plus(b.marriage), new Decimal(0))
      .toNumber();

    const attendanceList = reportList.filter((e) => e.isWork);

    obj.attendanceCount = attendanceList.length;

    obj.workdayCount = attendanceList.filter((e) =>
      [TYPE_DAY_OBJ.WEEKDAY.code, TYPE_DAY_OBJ.MAKEUP.code].includes(e.typeId)
    ).length;

    obj.totalTimeRatioPoint = new Decimal(totalOtherRatioPoint)
      .plus(totalGastroscopyRatioPoint)
      .toNumber();

    obj.serve = roleId === ROLES[1].code ? 2 : 0;

    iEmployeeReportList.push(obj);
  });

  /**
   * 解析工作记录字符串
   * @param {string} record 当日填写的工作记录
   * @returns {IPoint[]} 工分详细列表
   */
  function parseRecord(
    employeeName: string,
    record: string,
    ratio: number[],
    date: string,
    code: string
  ): IPoint[] {
    // 节假日, 周末上班
    const isWeekendOrHolidayOvertime = [
      TYPE_DAY_OBJ.HOLIDAY.code,
      TYPE_DAY_OBJ.WEEKEND.code,
    ].includes(code);

    const nRecord = removeSpaces(fullWidthToHalfWidth(record));

    if (/\d/.test(nRecord)) {
      const parts = nRecord.split("/");
      const arr = [];
      parts.forEach((part) => {
        const p = parsePart(
          part,
          employeeName,
          ratio,
          date,
          isWeekendOrHolidayOvertime
        );
        if (p) {
          arr.push(p);
        } else {
          const error = `${employeeName}：${date} 的工分记录：${nRecord} 填写错误，无法解析，请核对！！！`;
          errorList.push(error);
        }
      });
      return parts
        .map((e) =>
          parsePart(e, employeeName, ratio, date, isWeekendOrHolidayOvertime)
        )
        .flat()
        .filter((e) => e !== undefined) as IPoint[];
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
    ratio: number[],
    date: string,
    isWeekendOrHolidayOvertime: boolean
  ): IPoint[] | undefined {
    // xx+胃 的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.GASTROSCOPY.text) &&
      TYPE_POST_OBJ.GASTROSCOPY.text
        .map((e) => part.indexOf(e))
        .filter((e) => e > 0).length > 0
    ) {
      return undefined;
    }

    // xx+手 的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.OTHER.text) &&
      TYPE_POST_OBJ.OTHER.text.map((e) => part.indexOf(e)).filter((e) => e > 0)
        .length > 0
    ) {
      return undefined;
    }

    // 手7.5胃1.5的情况
    if (
      isStringExistArrayElement(part, TYPE_POST_OBJ.GASTROSCOPY.text) &&
      isStringExistArrayElement(part, TYPE_POST_OBJ.OTHER.text)
    ) {
      return undefined;
    }

    // 0.x年假的时候
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
          errorList.push(error);
          continue;
        }

        const point = detail[i];

        const pointRatio = isWeekendOrHolidayOvertime ? ratio[1] : ratio[i];
        const post = isStringExistArrayElement(
          part,
          TYPE_POST_OBJ.GASTROSCOPY.text
        )
          ? TYPE_POST_OBJ.GASTROSCOPY
          : TYPE_POST_OBJ.OTHER;
        const type = isWeekendOrHolidayOvertime
          ? TYPE_POINT_OBJ.ATTENDANCE.OVERTIME
          : Object.values(TYPE_POINT_OBJ.ATTENDANCE)[i];
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

  return {
    iEmployeeReportList,
    currentDate,
    errorList
  };
}
