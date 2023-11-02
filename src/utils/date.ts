import * as dayjs from "dayjs";

import { DEFAULT, TYPE_DAY_OBJ } from "@/constants";

import useStore from "@/store";
import { CodeText } from "@/types";

interface DayTypeRatio extends CodeText {
  ratio: number[];
}

/**
 * 获取日期类型：工作日上班；周末加班；节假日上班
 * @param {string} date YYYY年MM月DD日
 * @returns {CodeText}
 */
export function getTypeAndRatioOfDay(date: string): DayTypeRatio {
  const holiday = useStore().holiday.holidayList.find((e) => e.date === date);
  if (holiday) {
    const typeId = holiday.typeId;
    if (typeId === "0") {
      return Object.assign(TYPE_DAY_OBJ.MAKEUP, {
        ratio: [holiday.workWeight, holiday.extraWeight],
      });
    } else if (typeId === "1") {
      return Object.assign(TYPE_DAY_OBJ.HOLIDAY, {
        ratio: [holiday.workWeight, holiday.extraWeight],
      });
    } else {
      return Object.assign(TYPE_DAY_OBJ.UNKNOWN, {
        ratio: [holiday.workWeight, holiday.extraWeight],
      });
    }
  } else {
    const dayOfWeek = dayjs(date).day(); // 获取日期的星期几
    return dayOfWeek === 0 || dayOfWeek === 6
      ? Object.assign(TYPE_DAY_OBJ.WEEKEND, {
          ratio: [DEFAULT.RATIO.WORK, DEFAULT.RATIO.OVERTIME],
        })
      : Object.assign(TYPE_DAY_OBJ.WEEKDAY, {
          ratio: [DEFAULT.RATIO.WORK, DEFAULT.RATIO.OVERTIME],
        });
  }
}

/**
 * 将XX年XX日 转换为 YYYY/MM/DD
 * @param {string} target
 * @returns {string} YYYY/MM/DD
 */
export function getDateStringFromMonthDay(target: string): string {
  // 使用正则表达式来提取月份和日
  const match = target.match(/(\d{1,2})月(\d{1,2})日/);

  if (match) {
    const currentYear = dayjs().year(); // 获取当前年份
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);

    // 使用 Day.js 创建完整的日期
    const fullDate = dayjs(`${currentYear}-${month}-${day}`);

    // 格式化日期
    return fullDate.format(DEFAULT.DATE_FORMAT);
  } else {
    return "";
  }
}
