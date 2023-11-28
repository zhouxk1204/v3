import * as dayjs from "dayjs";

import { getFirstMonDayOfMonth, getLastSunDayOfMonth } from "@/utils/date";

import { DATE_FORMAT } from "@/constants";
import { ref } from "vue";

export function useCalendar(year: number, month: number) {
  let date = getFirstMonDayOfMonth(year, month);
  const endDate = getLastSunDayOfMonth(year, month);

  const list: any[] = [];
  while (
    dayjs(date).isSame(endDate, "day") ||
    dayjs(date).isBefore(endDate, "day")
  ) {
    const iDay = {
      date: date.format(DATE_FORMAT),
      year: date.year(),
      month: date.month() + 1,
      dayOfMonth: date.format("DD"),
      dayOfWeek: date.day(),
    };
    list.push(iDay);
    date = date.add(1, "day");
  }

  console.log("%c Line:29 🥤 list", "color:#465975", list);
  return {
    list,
  };
}
