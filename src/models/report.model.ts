import { TYPE_POINT_OBJ, TYPE_POST_OBJ } from "@/constants";
import {
  fullWidthToHalfWidth,
  parsePositiveRealNumber,
  removeSpaces,
} from "@/utils/string";

import { isStringExistArrayElement } from "@/utils";
import { getTypeAndRatioOfDay } from "@/utils/date";

export interface IPoint {
  type: string; // 类别
  typeName: string; // 类别
  postId?: string; // 岗位id
  postName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  pointRatio?: number; // 岗位工分倍率
}

export class Point {
  type: string; // 类别
  typeName: string; // 类别
  postId?: string; // 岗位id
  postName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  pointRatio?: number; // 岗位工分倍率

  constructor(data: IPoint) {
    this.type = data.type;
    this.typeName = data.typeName;
    this.postId = data.postId;
    this.postName = data.postName;
    this.point = data.point;
    this.pointRatio = data.pointRatio;
  }

  get ratioPoint(): number {
    return this.pointRatio ? this.point * this.pointRatio : 0;
  }
}

export interface IDailyRecord {
  employeeName: string;
  date: string;
  record: string;
}

export class DailyRecord {
  date: string;
  employeeName: string;
  typeId: string; // 工作日 0 ；周末加班 1；节假日加班 2
  typeName: string; // 工作日；周末加班；节假日加班
  record: string;
  pointList: Point[] = [];
  ratio: number[] = [];
  constructor(data: IDailyRecord) {
    this.employeeName = data.employeeName;
    this.date = data.date;
    this.record = removeSpaces(fullWidthToHalfWidth(data.record));
    const { code, text, ratio } = getTypeAndRatioOfDay(data.date);
    this.typeId = code;
    this.typeName = text;
    this.ratio = ratio;
    this.pointList = this.parseRecord(this.record);
  }

  /**
   * 解析工作记录字符串
   * @param {string} record 当日填写的工作记录
   * @returns {Point[]} 工分详细列表
   */
  private parseRecord(record: string): Point[] {
    if (/\d/.test(record)) {
      const parts = record.split("/");
      return parts.map((e) => this.parsePart(e)).flat();
    } else {
      // 休，年休等
      let point = new Point({
        type: "unknown",
        typeName: "未知",
        point: 1,
      });
      for (let item of Object.values(TYPE_POINT_OBJ.REST)) {
        if (item.text.includes(record)) {
          point = new Point({
            type: item.code,
            typeName: item.text[0],
            point: 1,
          });
          break;
        }
      }
      return [point];
    }
  }

  /**
   * 解析工作记录部分字符串
   * @param {string} part 当日填写的工作记录
   * @returns {Point[]} 工分详细列表
   */
  private parsePart(part: string): Point[] {
    // 0.x年假的时候
    const annual = TYPE_POINT_OBJ.REST.ANNUAL_LEAVE;

    if (isStringExistArrayElement(part, annual.text)) {
      return [
        new Point({
          type: annual.code,
          typeName: annual.text[0],
          point: parsePositiveRealNumber(part),
        }),
      ];
    } else {
      // 胃镜的场合
      const detail = part.split("+").map((el) => parsePositiveRealNumber(el));

      const pointList: Point[] = [];
      for (let i = 0; i < detail.length; i++) {
        // 无法解析的时候
        if (i > 1) {
          console.error(
            `${this.employeeName}：${this.date} 的工分记录：${part} 填写错误，无法解析，请核对！！！`
          );
          continue;
        }

        const point = detail[i];
        const pointRatio = this.ratio[i];
        const post = isStringExistArrayElement(
          part,
          TYPE_POST_OBJ.GASTROSCOPY.text
        )
          ? TYPE_POST_OBJ.GASTROSCOPY
          : TYPE_POST_OBJ.OPERATION;
        const type = Object.values(TYPE_POINT_OBJ.ATTENDANCE)[i];
        pointList.push(
          new Point({
            type: type.code,
            typeName: type.text,
            postId: post.code,
            postName: post.text[0],
            point,
            pointRatio,
          })
        );
      }
      return pointList;
    }
  }
}
