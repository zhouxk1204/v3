import * as dayjs from "dayjs";

import { getFirstMondayOfMonth, getLastSundayOfMonth } from "@/utils/date";

import { DATE_FORMAT } from "@/constants";
import useStore from "@/store";
import { toRaw } from "vue";

export function useCalendar(year: number, month: number) {
  let date = getFirstMondayOfMonth(year, month);
  const endDate = getLastSundayOfMonth(year, month);
  const list: any[] = [];

  const holidayList = toRaw(useStore().holiday.holidayList);

  while (
    dayjs(date).isSame(endDate, "day") ||
    dayjs(date).isBefore(endDate, "day")
  ) {
    const holiday = holidayList.find((e) => dayjs(e.date).isSame(date));
    const iDay = {
      date: date.format(DATE_FORMAT),
      year: date.year(),
      month: date.month() + 1,
      dayOfMonth: date.format("DD"),
      dayOfWeek: date.day(),
      name: holiday ? holiday.name : "",
      type: holiday ? holiday.typeId : "",
    };
    list.push(iDay);
    date = date.add(1, "day");
  }

  return {
    list,
  };
}
