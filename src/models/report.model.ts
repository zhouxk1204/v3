export interface IRecord {
  date: string;
  employeeName: string;
  record: string;
}

export interface IEmployeeReport {
  employeeName: string;
  factor: string;
  totalOtherRatioPoint: number;
  totalGastroscopyRatioPoint: number;
  annual: number;
  marriage: number;
  attendanceCount: number;
  workdayCount: number;
  totalTimeRatioPoint: number;
  serve: number;
}
