export interface Employee {
  id: string;
  no: number; // 顺序
  name: string; // 姓名
  factor: number; // 系数
  positionId: string; // "0": 护士; "1": 护士长
  position: string; //
  genderId: string; // "0": 女; "1": 男
  gender: string; //
  statusId: string; // "0": 离职; "1": 在职
  status: string; //
  weighted: number;
}

export interface EmployeeForm {
  no: number;
  name: string;
  factor: number;
  genderId: string; // "0": 女; "1": 男
  statusId: string; // "0": 离职; "1": 在职
  positionId: string; // "0": 护士; "1": 护士长
}

export interface EmployeeSearchForm {
  name: string; // 姓名
  genderId: string; // "0": 女; "1": 男
  statusId: string; // "0": 离职; "1": 在职
  positionId: string; // "0": 护士; "1": 护士长
}

export interface EmployeeTableData {
  id: string; // uuid
  no: number; // 顺序
  name: string; // 姓名
  factor: number; // 当前系数
  baseFactor: number; //
  weighted: number; //
  positionId: string; // "0": 护士; "1": 护士长
  position: string; //
  genderId: string; // "0": 女; "1": 男
  gender: string; //
  statusId: string; // "0": 离职; "1": 在职
  status: string; //
  entryDate: string; // 入职年月
}

export interface EmployeeUpdateInfo {
  no: number;
  name: string; // 姓名
  factor: number; // 当前系数
  genderId: string; // "0": 女; "1": 男
  statusId: string; // "0": 离职; "1": 在职
  positionId: string; // "0": 护士; "1": 护士长
  updateBy: string; //
}

export interface EmployeeAddInfo {
  name: string; // 姓名
  factor: number; // 当前系数
  genderId: string; // "0": 女; "1": 男
  statusId: string; // "0": 离职; "1": 在职
  positionId: string; // "0": 护士; "1": 护士长
  createBy: string; //
}
