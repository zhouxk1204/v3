import * as dayjs from "dayjs";

import { DEFAULT, TYPE_DAY_OBJ } from "@/constants";

import useStore from "@/store";
import { CodeText } from "@/types";

interface DayTypeRatio extends CodeText {
  ratio: number[];
}

/**
 * 获取日期类型：工作日上班；周末加班；节假日加班；节假日补班
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
    const dayOfWeek = dayjs(date).day();
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

    // 格式化日期
    return fullDate.format(DEFAULT.DATE_FORMAT);
  } else {
    return "";
  }
}

/**
 * 将Excel date number 格式化
 * @param {number} excel date number
 * @returns {string} YYYY/MM/DD
 */
export function parseExcelDateNumber(date: number): string {
  return dayjs("1900-01-01")
    .add(date - 2, "day")
    .format(DEFAULT.DATE_FORMAT);
}

/**
 * 获取某月的第一个星期一
 * @param {number} year
 * @param {number} month
 * @returns {dayjs.Dayjs} 第一个星期一
 */
export function getFirstMondayOfMonth(
  year: number,
  month: number
): dayjs.Dayjs {
  return dayjs(`${year}-${month}`)
    .startOf("month")
    .startOf("week")
    .add(1, "day");
}

/**
 * 获取某月的最后一个星期天
 * @param {number} year
 * @param {number} month
 * @returns {dayjs.Dayjs} 最后一个星期天
 */
export function getLastSundayOfMonth(year: number, month: number): dayjs.Dayjs {
  const day = dayjs(`${year}-${month}`).endOf("month");
  return day.day() === 0 ? day : day.endOf("week").add(1, "day");
}

/**
 * 获取某月的所有日期
 * @param {number} year
 * @param {number} month
 * @param {string} pattern
 * @returns {string[]} 所有日期
 */
export function getWeekDatesArrayOfMonthYear(
  year: number,
  month: number,
  pattern: string = "YYYY-MM-DD"
): string[] {
  let start = getFirstMondayOfMonth(year, month);
  const end = getLastSundayOfMonth(year, month);
  const result: string[] = [];
  while (dayjs(start).isSame(end, "day") || dayjs(start).isBefore(end, "day")) {
    result.push(start.format(pattern));
    start = start.add(1, "day");
  }
  return result;
}

/**
 * 将xx月xx日转换为 yyyy/mm/dd
 * @param {string} target xx月xx日
 */
export function parseMonthDayTextDate(target: string) {
  const match = target.match(/(\d+)月(\d+)日/);

  if (match) {
    const month = parseInt(match[1], 10); // 提取月份并转换为数字
    const day = parseInt(match[2], 10); // 提取日期并转换为数字

    // 获取当前年份
    const currentYear = dayjs().year();

    // 创建 Day.js 对象
    const date = dayjs(`${currentYear}-${month}-${day}`);

    // 使用 format 方法将日期格式化为指定的字符串格式
    return date.format(DEFAULT.DATE_FORMAT);
  } else {
    console.error("无法解析日期字符串");
    return "Invalid date";
  }
}
