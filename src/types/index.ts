export interface IDayType {
  typeId: string;
  typeName: string;
}

export interface CodeText {
  code: string;
  text: string;
}

export interface ExcelOption {
  title?: string;
  headers: string[];
  data: any[][];
  position?: string;
  // tStartCell?: {
  //   row: string;
  //   col: string;
  // }; // A
  // tStartCol?: {
  //   row: string;
  //   col: string;
  // }; // 1
}

export interface AudioInfo {
  url: string;
  title: string;
  artist: string;
  cover: string;
}

export interface IReport {
  employeeId: string; // 姓名id
  factor: number; // 系数
  totalWorkPointsOtherJob: number; // 其他岗位上班总工分
  totalOvertimePointsOtherJob: number; // 其他岗位加班总工分
  totalPointsOtherJob: number; // 其他岗位总工分
  totalWorkPointSpJob: number; // 胃2岗位上班总工分
  totalOvertimePointsSpJob: number; // 胃2岗位加班总工分
  totalPointsSpJob: number; // 胃2岗位总工分
  totalPoints: number; // 时间总工分
  annualCount: number; // 年休天数
  marriageCount: number; // 婚假天数
  attendanceCount: number; // 总出勤天数(包括周末，节假日)
  workdayCount: number; // 工作日出勤天数（包括工作日，节假日补班）
  serveCount: number; // 科务天数
}

export interface IDayRecord {
  date: string;
  record: string;
  employeeName: string;
}

export interface IOption {
  label: string;
  value: string;
}

export type SelectType =
  | "gender" // 性别
  | "post" // 职位
  | "job" // 岗位
  | "workType" // 工作种类
  | "holiday" // 法定节假日
  | "holidayType" // 法定节假日类型
  | "employee"; // 员工

export interface IEmployee {
  id: string;
  no: number; // 序号
  employeeName: string; // 姓名
  factor: number; // 系数
  genderId: string; // 性别
  postId: string; // 职位
}

export interface IHoliday {
  id: string;
  date: string; // 日期
  holidayId: string; // 节假日 id
  holidayTypeId: string; // 放假/补班 id
  workRatio: string; // 补班工作倍率
  extraRatio: string; // 加班工作倍率
}

export interface IDayRatioSetting {
  id: string;
  employeeId: string; // 姓名
  date: string; // 日期
  jobId: string; // 岗位
  workTypeId: string; // 上班/加班 id
  ratio: string;
  remark: string;
}

export interface IPoint {
  typeId: string; // 类别id 上班，加班，休假
  typeName: string; // 类别名称 上班，加班，休假
  jobId?: string; // 岗位id
  jobName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  pointRatio?: number; // 岗位工分倍率
  ratioPoint?: number; // 岗位工分 * 岗位工分倍率
}
