export interface EmployeeReq {
  no: number;
  name: string;
  factor: number;
  positionId: "0" | "1";
  genderId: "0" | "1";
}

export interface Employee extends EmployeeReq {
  id: number;
  genderName: string;
  positionName: string;
}
