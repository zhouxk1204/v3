import * as dayjs from "dayjs";

import {
  DEFAULT_OVERTIME_RATIO,
  DEFAULT_WORK_RATIO,
  HOLIDAY_MAKEUP,
  JOB_INFO,
  POST_INFO,
  REST_INFO,
  WORK_TYPE_INFO,
} from "@/constants";
import { IEmployee, IPoint, IReport } from "@/types";
import { fullToHalf, trim } from "@/utils/string";

import Decimal from "decimal.js";
import { IRecord } from "@/models/report.model";
import useStore from "@/store";

interface RatioInfo {
  ratio: number;
  type: {
    label: string;
    id: string;
  };
}

/**
 * 根据休日文字获取信息
 * @param {string} text
 * @returns {IPoint | null}
 */
const getRestInfoByText = (text: string): IPoint | null => {
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
 * @returns {[number, number, boolean]}
 */
const getRatio = (
  date: string,
  jobId: string,
  employeeId: string
): [RatioInfo, RatioInfo] => {
  let res: [RatioInfo, RatioInfo];
  // 节假日列表
  const holidayList = useStore().holiday.list;
  const holiday = holidayList.find((e) => e.date === date);
  if (holiday) {
    const workRatio = +holiday.workRatio;
    const extraRatio = +holiday.extraRatio;
    // 判断补班还是加班
    res =
      holiday.holidayTypeId === HOLIDAY_MAKEUP
        ? [
            {
              ratio: workRatio,
              type: WORK_TYPE_INFO.MAKEUP,
            },
            {
              ratio: extraRatio,
              type: WORK_TYPE_INFO.MAKEUP_OVERTIME,
            },
          ]
        : [
            {
              ratio: extraRatio,
              type: WORK_TYPE_INFO.HOLIDAY,
            },
            {
              ratio: extraRatio,
              type: WORK_TYPE_INFO.HOLIDAY,
            },
          ];
  } else {
    const dayOfWeek = dayjs(date).day();
    // 周末加班的情况
    if ([0, 6].includes(dayOfWeek)) {
      res = [
        {
          ratio: DEFAULT_OVERTIME_RATIO,
          type: WORK_TYPE_INFO.WEEKEND_OVERTIME,
        },
        {
          ratio: DEFAULT_OVERTIME_RATIO,
          type: WORK_TYPE_INFO.WEEKEND_OVERTIME,
        },
      ];
    } else {
      res = [
        {
          ratio: DEFAULT_WORK_RATIO,
          type: WORK_TYPE_INFO.WEEKDAY,
        },
        {
          ratio: DEFAULT_OVERTIME_RATIO,
          type: WORK_TYPE_INFO.WEEKDAY_OVERTIME,
        },
      ];
    }
  }

  // 岗位特殊设定
  const ratioSetting = useStore().dayRatioSetting.list;
  const setting = ratioSetting.find(
    (el) =>
      el.date === date && // 日期
      el.jobId === jobId && // 岗位
      el.employeeId === employeeId // 姓名
  );
  if (setting) {
    if (setting.workTypeId === "0") {
      res[0].ratio = +setting.ratio;
    } else {
      res[1].ratio = +setting.ratio;
    }
  }
  return res;
};

const getJobNameById = (id: string) => {
  return getLabelById(id, JOB_INFO);
};

const getLabelById = (id: string, obj: Object) => {
  return Object.values(obj).find((e) => e.id === id)?.label[0] ?? "not found";
};

export function useReport(data: IRecord[][]) {
  const reports: IReport[] = [];
  // 保存报表所在的日期
  let currentDate = data[0][0].date;
  // 异常记录
  const errors: string[] = [];

  for (let item of data) {
    const iEmployee = useStore().employee.list.find(
      (el) => el.employeeName === item[0].employeeName
    );
    if (iEmployee) {
      let pointList: IPoint[][] = [];
      for (let e of item) {
        const { record, date } = e;
        const iPoints = parseRecord(iEmployee, record, date);
        pointList.push(iPoints);
        if (iPoints.length === 0) {
          errors.push(
            `${iEmployee.employeeName}：在${date} 填写的工分记录：${record} 填写错误，无法解析，请核对！！！`
          );
        }
      }
      const list = pointList.flat();

      let annual = new Decimal(0);
      let totalWorkOther = new Decimal(0);
      let totalWorkGastroscopy = new Decimal(0);
      let totalOvertimeOther = new Decimal(0);
      let totalOvertimeGastroscopy = new Decimal(0);
      list.forEach((el) => {
        const { typeId, ratioPoint = 0 } = el;
        if (typeId === REST_INFO.ANNUAL_LEAVE.id) {
          annual = annual.plus(el.point);
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
      const iReport: IReport = {
        employeeName: iEmployee.employeeName,
        factor: iEmployee.factor,
        annual: annual.toNumber(),
        totalWorkOther: totalWorkOther.toNumber(),
        totalWorkGastroscopy: totalWorkGastroscopy.toNumber(),
        totalOvertimeOther: totalOvertimeOther.toNumber(),
        totalOvertimeGastroscopy: totalOvertimeGastroscopy.toNumber(),
        totalOther: totalOther.toNumber(),
        totalGastroscopy: totalGastroscopy.toNumber(),
        total: totalOther.plus(totalGastroscopy.times(1.2)).toNumber(),
        serve: iEmployee.postId === POST_INFO.HEAD_NURSE.id ? 2 : 0,
      };
      reports.push(iReport);
    }
  }

  /**
   * 解析工作记录字符串
   * @param {iEmployee} iEmployee 职员
   * @param {string} record 工分记录
   * @param {string} date 日期
   * @returns {IPoint[]} 工分详细列表
   */
  function parseRecord(
    iEmployee: IEmployee,
    record: string,
    date: string
  ): IPoint[] {
    // 去掉空格和大写转小写
    record = trim(fullToHalf(record));

    // 1.纯文字的记录：各种休
    if (!/\d/.test(record)) {
      // 获取休日信息
      const iPoint: IPoint | null = getRestInfoByText(record);
      if (iPoint) {
        return [iPoint];
      } else {
        return [];
      }
    } else {
      // 2.按'/'分成不同的种类进行解析
      const parts = record.split("/");
      if (parts.length > 2) {
        return [];
      } else {
        const res: IPoint[][] = [];
        for (let part of parts) {
          const iPoints = parsePart(date, part, iEmployee.id);
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
    }
  }

  /**
   * 解析岗位工分记录字符串
   * @param {string} date 日期
   * @param {string} part 岗位工分记录
   * @param {string} employeeId 职员id
   * @returns {IPoint[]} 工分详细列表
   */
  function parsePart(date: string, part: string, employeeId: string): IPoint[] {
    // 确定岗位
    let job = JOB_INFO.ERROR;

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

    // 当日是否为工作日或节假日补班
    const ratios = getRatio(date, jobId, employeeId);

    return part.split("+").map((e, i) => {
      const point = +e.replace(/[\u4e00-\u9fa5]/g, "");
      const pointRatio = ratios[i].ratio;
      const ratioPoint = new Decimal(point).times(pointRatio).toNumber();
      const type = ratios[i].type;
      return {
        point,
        pointRatio,
        ratioPoint,
        jobId,
        jobName: getJobNameById(jobId),
        typeId: type.id, // 0 上班，1：加班
        typeName: type.label, // 0 上班，1：加班,
      };
    });
  }

  return {
    reports,
    currentDate,
    errors,
  };
}
