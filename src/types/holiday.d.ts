export interface Holiday {
  id: string;
  date: [string, string]; // 日期
  hId: string; // 节假日 id
  tId: string; // 放假/补班 id
  ratio1: string; // 补班工作倍率
  ratio2: string; // 加班工作倍率
}

export interface HolidaySearchForm {
  holidayId: string;
  statusId: string;
  year: string;
}
