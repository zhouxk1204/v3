import { ResponseData, http } from "../request";

import { Employee } from "./type";

export const submitEmployee = (employee: Employee) => {
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

// export const updateEmployeeById = (id: number) => {
//   return http.delete<ResponseData<Object>>("/employee/delete", {
//     params: { id },
//   });
// };
