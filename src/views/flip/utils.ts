import dayjs, { Dayjs } from "dayjs";
import solarlunar from "solarlunar";

export const getDateStr = (input: Dayjs | Date | string) => {
  const d = dayjs(input);

  const lunar = solarlunar.solar2lunar(
    d.year(),
    d.month() + 1, // dayjs 月份从 0 开始
    d.date()
  );
  return `${lunar.cYear}年${lunar.cMonth}月${lunar.cDay}日 ${lunar.monthCn}${lunar.dayCn} ${lunar.ncWeek}`;
};
