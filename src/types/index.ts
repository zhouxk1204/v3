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

export interface IHoliday {
  id: number;
  date: string; // 日期
  name: string; // 节假日名称id
  type: string; // 放假/补班名称id
  workRadio: number; // 补班工作倍率
  extraRadio: number; // 加班工作倍率
}

// export interface IEmployee {
//   id: number;
//   no: number; // 序号
//   name: string; // 姓名
//   factor: number; // 系数
//   gender: string; // 性别
//   post: string; // 职位
// }

export interface IDayRatio {
  id: number;
  employeeId: string; // 姓名id
  date: string; // 日期
  jobId: string; // 岗位id
  statusId: string; // 上班？ 加班
  ratio: number; // 倍率
  remark: string; // 原因备注
}

export interface IMonthReport {
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
  | "work" // 工作种类
  | "holiday" // 法定节假日
  | "holidayType"; // 法定节假日类型

type EditTypeName = "text" | "number" | "date";
type EditTypeName2 = "select";

type EditType<
  T extends {
    name: EditTypeName | EditTypeName2;
    key?: SelectType;
  }
> = T["name"] extends EditTypeName2
  ? { name: EditTypeName2; key: SelectType }
  : { name: EditTypeName };

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type: EditType<{ name: EditTypeName }> | EditType<{ name: EditTypeName2 }>;
}

export interface IEmployeeTableColumn {
  no: number; // 序号
  name: string; // 姓名
  factor: number; // 系数
  genderId: string; // 性别
  postId: string; // 职位
}

export interface IEmployee extends IEmployeeTableColumn {
  id: number;
  gender: string;
  post: string;
}

export type EditRowTemp<T> = {
  [K in keyof T]: T[K] extends number ? number : string;
};
