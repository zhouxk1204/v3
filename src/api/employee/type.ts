export interface Employee {
  no: number; // 顺序
  name: string; // 姓名
  factor: number; // 系数
  positionId: "0" | "1"; // "0": 护士; "1": 护士长
  genderId: "0" | "1"; // "0": 女; "1": 男
  statusId: "0" | "1"; // "0": 离职; "1": 在职
}

// export interface Employee extends EmployeeReq {
//   id: number;
//   genderName: string;
//   positionName: string;
//   statusName: string;
// }
