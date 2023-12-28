export interface IRecord {
  date: string;
  employeeName: string;
  record: string;
}

export interface IPoint {
  typeId: string; // 类别
  typeName: string; // 类别
  postId?: string; // 岗位id
  postName?: string; // 岗位名称
  point: number; // 岗位工分（小时）
  pointRatio?: number; // 岗位工分倍率
  ratioPoint?: number; // 岗位工分 * 岗位工分倍率
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

export interface IRateSetting {
  id: string;
  no: string;
  name: string;
  date: string;
  postId: string;
  postName: string;
  statusId: string;
  statusName: string;
  rate: number;
  remark: string;
}
