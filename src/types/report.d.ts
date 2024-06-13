export interface Report {
  employeeName: string; // 姓名
  factor: number; // 系数
  totalWorkOther: number;
  totalWorkGastroscopy: number;
  totalOvertimeOther: number;
  totalOvertimeGastroscopy: number;
  totalOther: number;
  totalGastroscopy: number; // 胃2总工分
  total: number; // 时间总工分
  annual: number; // 年休天数
  leave: number; // 休假天数
  workDayCount: number; // 工作日出勤天数（包括工作日，节假日补班）
  workCount: number; // 工作天数（包括工作日，周末加班，节假日加班）
  serve: number; // 科务天数
}
