import { ResponseData, http } from "../request";
import { Employee, EmployeeReq } from "./type";

export const submitEmployee = (employee: EmployeeReq) => {
  return http.post("/employee/insert", employee);
};

export const getEmployee = () => {
  return http.get<ResponseData<Employee[]>>("/employee/query");
};

export const deleteEmployeeById = (id: number) => {
  return http.delete<ResponseData<Object>>("/employee/delete", {
    params: { id },
  });
};
