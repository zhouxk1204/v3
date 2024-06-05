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

export interface HolidayTableData {
  no: number;
  dateStart: string;
  dateEnd: string;
  id: string;
  name: string;
  type: string;
  typeName: string;
  ratio1: number;
  ratio2: number;
}

export interface HolidaySearchForm2 {
  year: string;
  id: string;
}

export interface HolidayAddInfo {
  dateStart: string;
  dateEnd: string;
  id: string;
  type: string;
  ratio1: number;
  ratio2: number;
  createBy: string;
}

export interface HolidayUpdateInfo {
  dateStart: string;
  dateEnd: string;
  id: string;
  type: string;
  ratio1: number;
  ratio2: number;
  updateBy: string;
  no: number;
}
