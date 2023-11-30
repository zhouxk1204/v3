import * as dayjs from "dayjs";

import { getFirstMonDayOfMonth, getLastSunDayOfMonth } from "@/utils/date";

import { DATE_FORMAT } from "@/constants";
import useStore from "@/store";
import { toRaw } from "vue";

export function useCalendar(year: number, month: number) {
  let date = getFirstMonDayOfMonth(year, month);
  const endDate = getLastSunDayOfMonth(year, month);

  const list: any[] = [];

  const holidayList = toRaw(useStore().holiday.holidayList);
  console.log("%c Line:16 🌰 holidayList", "color:#ffdd4d", holidayList);

  while (
    dayjs(date).isSame(endDate, "day") ||
    dayjs(date).isBefore(endDate, "day")
  ) {
    const holiday = holidayList.find((e) => dayjs(e.date).isSame(date));
    console.log("%c Line:23 🍺 holiday", "color:#ed9ec7", holiday);
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

  console.log("%c Line:29 🥤 list", "color:#465975", list);
  return {
    list,
  };
}
