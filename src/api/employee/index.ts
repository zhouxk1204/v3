import { ResponseData, http } from "../request";

import { Employee } from "@/types/employee";

export const submitEmployee = (employee: Employee | Employee[]) => {
  return http.post("/employee/insert", employee);
};

export const getEmployee = () => {
  return http.get<ResponseData<Employee[]>>("/employee/query");
};

export const deleteEmployeeById = (id: string) => {
  return http.delete<ResponseData<Object>>("/employee/delete", {
    params: { id },
  });
};

export const updateEmployeeData = (employee: Employee) => {
  return http.post<ResponseData<Object>>("/employee/update", employee);
};
