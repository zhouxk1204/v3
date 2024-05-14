import { Employee, EmployeeForm, EmployeeSearchForm } from "@/types/employee";
import { ResponseData, http } from "./request";

interface updateModel extends EmployeeForm {
  id: string;
}
export const addEmployee = (employee: updateModel | updateModel[]) => {
  return http.post("/employee/insert", employee);
};

export const getEmployeeList = (employeeSearchForm?: EmployeeSearchForm) => {
  return http.get<ResponseData<Employee[]>>("/employee/query", {
    params: { form: employeeSearchForm ?? {} },
  });
};

export const deleteEmployeeByIds = (ids: string[]) => {
  return http.delete<ResponseData<Object>>("/employee/delete", {
    params: { ids },
  });
};

interface updateModel extends EmployeeForm {
  id: string;
}
export const updateEmployeeData = (employee: updateModel) => {
  return http.post<ResponseData<Object>>("/employee/update", employee);
};
