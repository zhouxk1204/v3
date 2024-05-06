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
import { fullToHalf, trim } from "@/utils/string";

import Decimal from "decimal.js";
import dayjs from "dayjs";
import { isInRange } from "@/utils/date";
import useStore from "@/store";

interface Point {
  typeId: string; // 类别id 上班，加班，休假
  typeName: string; // 类别名称 上班，加班，休假
  jobId?: string; // 岗位id
  jobName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  pointRatio?: number; // 岗位工分倍率
  ratioPoint?: number; // 岗位工分 * 岗位工分倍率
}

interface RatioInfo {
  ratio: number;
  type: {
    label: string;
    id: string;
  };
}

export function useReport(data: Record[][]) {
  const reports: Report[] = [];
  // 保存报表所在的日期
  let currentDate = data[0][0].date;
  // 异常记录
  const errors: string[] = [];

  for (let item of data) {
    const employee = useStore().employee.employeeTempList.find(
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
          const p = getRestInfoByText(record);
          if (!p) {
            hasError = true;
          } else {
            pointList.push(p);
          }
        } else {
          // 当日是否为工作日或节假日补班
          const ratioObj = getRatio(date, employee.id);

          const typeid = Object.values(ratioObj)[0].map((e) => e.type.id)[0];

          if (
            [WORK_TYPE_INFO.MAKEUP.id, WORK_TYPE_INFO.WEEKDAY.id].includes(
              typeid
            )
          ) {
            workDayCount += 1;
          }
          workCount += 1;

          const iPoints = parseRecord(record, ratioObj);
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
const getRestInfoByText = (text: string): Point | null => {
  for (let item of Object.values(REST_INFO)) {
    if (item.label.includes(text)) {
      return {
        typeId: item.id,
        typeName: item.label[0],
        point: 1,
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
const getRatio = (
  date: string,
  employeeId: string
): {
  [k: string]: { ratio: number; type: { id: string; label: string } }[];
} => {
  let res: {
    [k: string]: RatioInfo[];
  } = {};

  const jobIds = Object.values(JOB_INFO).map((e) => e.id);

  // 节假日列表
  const holidayList = useStore().holiday.holidayTempList;
  const holiday = holidayList.find((e) => isInRange(e.date, date));
  if (holiday) {
    const workRatio = +holiday.ratio1;
    const extraRatio = +holiday.ratio2;
    // 判断是节假日补班还是节假日加班
    if (holiday.tId === HOLIDAY_TYPE.MAKEUP) {
      jobIds.forEach((jobId) => {
        res[jobId] = [
          {
            ratio: workRatio,
            type: WORK_TYPE_INFO.MAKEUP,
          },
          {
            ratio: extraRatio,
            type: WORK_TYPE_INFO.MAKEUP_OVERTIME,
          },
        ];
      });
    } else {
      jobIds.forEach((jobId) => {
        res[jobId] = [
          {
            ratio: extraRatio,
            type: WORK_TYPE_INFO.HOLIDAY,
          },
          {
            ratio: extraRatio,
            type: WORK_TYPE_INFO.HOLIDAY,
          },
        ];
      });
    }
  } else {
    const dayOfWeek = dayjs(date).day();
    // 是否是周末加班的情况
    if ([0, 6].includes(dayOfWeek)) {
      jobIds.forEach((jobId) => {
        res[jobId] = [
          {
            ratio: DEFAULT_OVERTIME_RATIO,
            type: WORK_TYPE_INFO.WEEKEND_OVERTIME,
          },
          {
            ratio: DEFAULT_OVERTIME_RATIO,
            type: WORK_TYPE_INFO.WEEKEND_OVERTIME,
          },
        ];
      });
    } else {
      jobIds.forEach((jobId) => {
        res[jobId] = [
          {
            ratio: DEFAULT_WORK_RATIO,
            type: WORK_TYPE_INFO.WEEKDAY,
          },
          {
            ratio: DEFAULT_OVERTIME_RATIO,
            type: WORK_TYPE_INFO.WEEKDAY_OVERTIME,
          },
        ];
      });
    }
  }

  // 岗位特殊设定
  const ratioSetting = useStore().dayRatioSetting.list;

  Object.keys(res).forEach((jobId) => {
    const setting = ratioSetting.find(
      (el) =>
        el.date === date && // 日期
        el.jobId === jobId && // 岗位
        el.employeeId === employeeId // 姓名
    );
    if (setting) {
      if (setting.workTypeId === "0") {
        res[jobId][0].ratio = +setting.ratio;
      } else {
        res[jobId][1].ratio = +setting.ratio;
      }
    }
  });

  return res;
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
  ratioObj: { [k: string]: RatioInfo[] }
): Point[] => {
  // 2.按'/'分成不同的种类进行解析
  const parts = record.split("/");
  if (parts.length > 2) {
    return [];
  } else {
    const res: Point[][] = [];
    for (let part of parts) {
      const iPoints = parsePart(part, ratioObj);
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
  ratioObj: { [k: string]: RatioInfo[] }
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
    };
  });
};
