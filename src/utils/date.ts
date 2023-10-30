import * as dayjs from "dayjs";

import { DAY_TYPE_OBJ } from "@/constants";
import { IDayType } from "@/types";
import useStore from "@/store";

/**
 * 获取日期类型：工作日上班；周末加班；节假日上班
 * @param {string} date YYYY年MM月DD日
 * @returns {IDayType}
 */
export function getTypeOfDay(date: string): IDayType {
  const holidayDateArray = useStore().holiday.holidayList.map((e) => e.date);
  if (holidayDateArray.includes(date)) {
    return DAY_TYPE_OBJ.HOLIDAY_OVERTIME;
  } else {
    const dayOfWeek = dayjs(date).day(); // 获取日期的星期几
    return dayOfWeek === 0 || dayOfWeek === 6
      ? DAY_TYPE_OBJ.WEEKEND_OVERTIME
      : DAY_TYPE_OBJ.WEEKDAY_WORK;
  }
}
