import * as dayjs from "dayjs";

import { TYPE_DAY_OBJ } from "@/constants";
import useStore from "@/store";
import { CodeText } from "@/types";

/**
 * 获取日期类型：工作日上班；周末加班；节假日上班
 * @param {string} date YYYY年MM月DD日
 * @returns {CodeText}
 */
export function getTypeOfDay(date: string): CodeText {
  const holiday = useStore().holiday.holidayList.find((e) => e.date === date);
  if (holiday) {
    const typeId = holiday.typeId;
    if (typeId === "0") {
      return TYPE_DAY_OBJ.MAKEUP;
    } else if (typeId === "1") {
      return TYPE_DAY_OBJ.HOLIDAY;
    } else {
      return TYPE_DAY_OBJ.UNKNOWN;
    }
  } else {
    const dayOfWeek = dayjs(date).day(); // 获取日期的星期几
    return dayOfWeek === 0 || dayOfWeek === 6
      ? TYPE_DAY_OBJ.WEEKEND
      : TYPE_DAY_OBJ.WEEKDAY;
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

    // 格式化日期为 "YYYY/MM/DD"
    return fullDate.format("YYYY/MM/DD");
  } else {
    return "";
  }
}
