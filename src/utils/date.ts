import { DEFAULT_DATE_FORMAT } from "@/constants";
import dayjs from "dayjs";

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
    return fullDate.format(DEFAULT_DATE_FORMAT);
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
    .format(DEFAULT_DATE_FORMAT);
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

    // 获取当前年份(12月是次年1月核算，年份应取上一年)
    const currentYear = month === 12 ? dayjs().year() - 1 : dayjs().year();

    // 创建 Day.js 对象
    const date = dayjs(new Date(currentYear, month - 1, day));

    // 使用 format 方法将日期格式化为指定的字符串格式
    return date.format(DEFAULT_DATE_FORMAT);
  } else {
    console.error("无法解析日期字符串");
    return "Invalid date";
  }
}
