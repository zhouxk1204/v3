import { TYPE_POINT_OBJ, TYPE_POST_OBJ } from "@/constants";
import {
  fullWidthToHalfWidth,
  parsePositiveRealNumber,
  removeSpaces,
} from "@/utils/string";

import { isStringExistArrayElement } from "@/utils";
import { getTypeOfDay } from "@/utils/date";

// import { Employee, EmployeeJson } from "src/app/models/employee.model";
// import {
//   MARK_LIST,
//   POST_OBJ,
//   ROLE_OBJ,
//   TYPE_DAY_OBJ,
//   TYPE_DETAIL_OBJ,
// } from "../constants/common.object.constant";
// import { getDayTypeByDate, getWeightByDate } from "../utils/holiday";

// import Decimal from "decimal.js";
// import { TYPE } from "../constants/commom.constant";
// import { TYPE_DETAIL_MAP } from "../constants/common.map.constant";

// export interface IPoint {
//   type: number; // 类别
//   point: number; // 岗位工分（小时）
//   post?: string; // 岗位
//   weight?: number; // 岗位工分倍率
// }

// export class Point {
//   type: number; // 上班，加班，休息
//   /**
//    * 岗位
//    * @type {number}
//    */
//   post: string;
//   /**
//    * 岗位工分（小时）
//    * @type {number}
//    */
//   point: number;
//   /**
//    * 岗位工分倍率
//    * @type {number}
//    */
//   weight: number = 0;

//   constructor(data: IPoint) {
//     const { point, weight = 0, post = "" } = data;
//     this.type = data.type;
//     this.post = post;
//     this.point = point;
//     this.weight = weight;
//   }

//   /**
//    * 岗位工分小计
//    * @type {number}
//    */
//   get subTotal(): number {
//     return this.weight === 0
//       ? 0
//       : new Decimal(this.point).times(this.weight).toNumber();
//   }
// }

// export interface IDayReport {
//   date: string; // 当日日期
//   record: string; // 工分记录
// }

// export class DayReport {
//   /**
//    * 日期
//    * @type {moment.Moment}
//    */
//   date: string;
//   /**
//    * 类别
//    * @type {number}
//    */
//   type: string;
//   /**
//    * 工分记录
//    * @type {string}
//    */
//   record: string;
//   /**
//    * 工分倍率 [上班，加班]
//    * @type {number}
//    */
//   weight: number[];
//   /**
//    * 工分详细列表
//    * @type {Point[]}
//    */
//   pointList: Point[] = [];

//   constructor(data: IDayReport) {
//     this.date = moment(data.date).format("YYYY/MM/DD");
//     this.record = this.getRecord(data.record);
//     this.weight = getWeightByDate(this.date);
//     this.type = getDayTypeByDate(this.date);
//   }

//   getRecord(record: string): string {
//     let res = record;
//     MARK_LIST.forEach((e) => {
//       if (res.indexOf(e.F) > -1) {
//         res = res.replace(e.F, e.H);
//       }
//     });
//     return res.replace(/\s*/g, "");
//   }

//   getPontList(): Point[] {
//     const restRecord = Object.values(TYPE_DETAIL_OBJ)
//       .filter((e) => e.K > 1)
//       .map((e2) => e2.V);

//     if (restRecord.includes(this.record)) {
//       return [
//         new Point({
//           type: TYPE_DETAIL_MAP.getKeyByValue(this.record) ?? -1,
//           point: 1,
//         }),
//       ];
//     } else {
//       // split record
//       const recordList = this.record.split("/").filter((e) => e.length > 0);
//       // empty record
//       if (recordList.length === 0) return [];
//       // parse record
//       return recordList.map((e) => this.parseRecord(e)).flat();
//     }
//   }

//   parseRecord(record: string): Point[] {
//     const list: Point[] = [];

//     // 0.x年休
//     if (record.indexOf(TYPE_DETAIL_OBJ.ANNUAL_LEAVE.V) > -1) {
//       return [
//         new Point({
//           type: TYPE_DETAIL_OBJ.ANNUAL_LEAVE.K,
//           point: +record.replace(/[^\d\.]+/g, ""),
//         }),
//       ];
//     }

//     const detailList: number[] = record
//       .split("+")
//       .map((e) => +e.replace(/[^\d\.]+/g, ""));

//     let [h1, h2, h3] = [0, 0, 0];

//     if (detailList.length === 3) {
//       h3 = detailList[0];
//       h1 = detailList[1];
//       h2 = detailList[2];
//     } else {
//       h1 = detailList[0];
//       h2 = detailList[1];
//     }

//     const isWorkDay = [
//       TYPE_DAY_OBJ.WORKDAY.K,
//       TYPE_DAY_OBJ.HOLIDAY_WORK.K,
//     ].includes(this.type);

//     const post =
//       record.indexOf("胃") > -1 ? POST_OBJ.SPECIAL.K : POST_OBJ.OTHER.K;

//     if (isWorkDay) {
//       if (h1 > 0) {
//         list.push(
//           new Point({
//             post,
//             point: h1,
//             type: TYPE_DETAIL_OBJ.WORK.K,
//             weight: this.weight[0],
//           })
//         );
//       }
//       if (h2 > 0) {
//         list.push(
//           new Point({
//             post,
//             point: h2,
//             type: TYPE_DETAIL_OBJ.OVERTIME.K,
//             weight: this.weight[1],
//           })
//         );
//       }
//       if (h3 > 0) {
//         list.push(
//           new Point({
//             post,
//             point: h3,
//             type: TYPE_DETAIL_OBJ.OVERTIME.K,
//             weight: this.weight[1],
//           })
//         );
//       }
//     } else {
//       list.push(
//         new Point({
//           post,
//           point: new Decimal(h1).plus(h2).plus(h3).toNumber(),
//           type: TYPE_DETAIL_OBJ.OVERTIME.K,
//           weight: this.weight[1],
//         })
//       );
//     }
//     return list;
//   }

//   getHourByType(type: number, post: string) {
//     return this.pointList
//       .filter((p) => p.type === type && p.post === post)
//       .reduce((a, b) => new Decimal(a).plus(b.point).toNumber(), 0);
//   }

//   getPointByPost(post: string) {
//     return this.pointList
//       .filter((p) => p.post === post)
//       .reduce((a, b) => new Decimal(a).plus(b.subTotal).toNumber(), 0);
//   }
// }

// export interface IEmployeeReport {
//   employeeId: string;
//   dayReportList: IDayReport[];
// }

// export class EmployeeReport {
//   employee: Employee;
//   dayReportList: DayReport[];
//   constructor(data: IEmployeeReport) {
//     this.employee = this.getEmployeeById(data.employeeId);
//     this.dayReportList = data.dayReportList.map((e) => new DayReport(e));
//   }

//   get otherWorkHour(): number {
//     return this.getTotalHourByType(TYPE_DETAIL_OBJ.WORK.K, POST_OBJ.OTHER.K);
//   }

//   get otherOvertimeHour(): number {
//     return this.getTotalHourByType(
//       TYPE_DETAIL_OBJ.OVERTIME.K,
//       POST_OBJ.OTHER.K
//     );
//   }

//   get otherTotalPoint() {
//     return this.getTotalPointByPost(POST_OBJ.OTHER.K);
//   }

//   get specialWorkHour(): number {
//     return this.getTotalHourByType(TYPE_DETAIL_OBJ.WORK.K, POST_OBJ.SPECIAL.K);
//   }

//   get specialOvertimeHour(): number {
//     return this.getTotalHourByType(
//       TYPE_DETAIL_OBJ.OVERTIME.K,
//       POST_OBJ.SPECIAL.K
//     );
//   }

//   get specialTotalPoint() {
//     return this.getTotalPointByPost(POST_OBJ.SPECIAL.K);
//   }

//   get serve(): number {
//     return this.employee.role === ROLE_OBJ.MANAGER.K ? 2 : 0;
//   }

//   get annual() {
//     return this.getPointByPost()
//   }

//   private getTotalHourByType(type: number, post: string): number {
//     return this.dayReportList
//       .map((e) => e.getHourByType(type, post))
//       .reduce((a, b) => a + b, 0);
//   }

//   private getTotalPointByPost(post: string): number {
//     return this.dayReportList
//       .map((e) => e.getPointByPost(post))
//       .reduce((a, b) => a + b, 0);
//   }

//   private getEmployeeById(id: string): Employee {
//     const list = JSON.parse(
//       localStorage.getItem("employeeList") ?? "[]"
//     ) as EmployeeJson[];
//     return new Employee(
//       list.find((e) => e.id === id) ?? {
//         id: "error",
//         workScheduleSort: -1,
//         name: "error",
//         factor: -1,
//         gender: -1,
//         role: -1,
//         status: -1,
//       }
//     );
//   }

//   private getLeaveByPost(post: number) {
//     if (post > TYPE_DETAIL_OBJ.ANNUAL_LEAVE.K) {
//       return this.dayReportList.filter((e) => e.point);
//     }
//   }
// }

export interface IPoint {
  type: string; // 类别
  duration: number; // 岗位工分（小时）
  postId?: string; // 岗位id
  postName?: string; // 岗位名称
  weight?: number; // 岗位工分倍率
}

export class Point {
  type: string; // 类别
  duration: number; // 岗位工分（小时）
  postId?: string; // 岗位id
  postName?: string; // 岗位名称
  weight?: number; // 岗位工分倍率

  constructor(data: IPoint) {
    this.type = data.type;
    this.postId = data.postId;
    this.postName = data.postName;
    this.weight = data.weight;
    this.duration = data.duration;
  }

  get point(): number {
    return this.weight ? this.duration * this.weight : 0;
  }
}

export interface IDailyRecord {
  date: string;
  record: string;
}

export class DailyRecord {
  date: string;
  typeId: string; // 工作日 0 ；周末加班 1；节假日加班 2
  typeName: string; // 工作日；周末加班；节假日加班
  record: string;
  pointList: Point[] = [];
  constructor(data: IDailyRecord) {
    this.date = data.date;
    this.record = removeSpaces(fullWidthToHalfWidth(data.record));
    const { code, text } = getTypeOfDay(data.date);
    this.typeId = code;
    this.typeName = text;
  }

  private parseRecord(record: string): Point[] {
    if (/\d/.test(record)) {
      const parts = record.split("/");
      return parts.map((e) => this.parsePart(e)).flat();
    } else {
      // 休，年休等
      let point = new Point({
        type: "unknown",
        duration: 1,
      });
      for (let item of Object.values(TYPE_POINT_OBJ.REST)) {
        if (item.text.includes(record)) {
          point = new Point({
            type: item.code,
            duration: 1,
          });
          break;
        }
      }
      return [point];
    }
  }

  private parsePart(part: string): Point[] {
    // 0.x年假的时候
    const annual = TYPE_POINT_OBJ.REST.ANNUAL_LEAVE;

    if (isStringExistArrayElement(part, annual.text)) {
      return [
        new Point({
          type: annual.code,
          duration: parsePositiveRealNumber(part),
        }),
      ];
    } else {
      // 胃镜的场合
      const detail = part.split("+").map((el) => parsePositiveRealNumber(el));
      console.log("%c Line:404 🍡 detail", "color:#93c0a4", detail);
      if (isStringExistArrayElement(part, TYPE_POST_OBJ.GASTROSCOPY.text)) {
        return [
          new Point({
            type: TYPE_POINT_OBJ.ATTENDANCE.WORK.code,
            duration: detail[0],
            postId: TYPE_POST_OBJ.GASTROSCOPY.code,
          }),
          new Point({
            type: TYPE_POINT_OBJ.ATTENDANCE.OVERTIME.code,
            duration: detail[1],
            postId: TYPE_POST_OBJ.GASTROSCOPY.code,
          }),
        ];
      } else {
        return [
          new Point({
            type: TYPE_POINT_OBJ.ATTENDANCE.WORK.code,
            duration: detail[0],
          }),
          new Point({
            type: TYPE_POINT_OBJ.ATTENDANCE.OVERTIME.code,
            duration: detail[1],
          }),
        ];
      }
    }
  }
}
