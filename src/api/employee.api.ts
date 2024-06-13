import {
  EmployeeAddInfo,
  EmployeeSearchForm,
  EmployeeTableData,
  EmployeeUpdateInfo,
} from "@/types/employee";
import { ResponseData, http } from "./request";

import { DictDetailTypeEnum } from "@/constants";
import { getSelectOptionByType2 } from "./common.api";

export const deleteEmployeeInfo = (nos: number[]) => {
  return http.delete<ResponseData<Object>>("/employee/delete", {
    params: { nos },
  });
};

export const addEmployeeInfo = (employeeAddInfo: EmployeeAddInfo) => {
  return http.post("/employee/insert", employeeAddInfo);
};

export const updateEmployeeInfo = (employeeUpdateInfo: EmployeeUpdateInfo) => {
  return http.post<ResponseData<Object>>(
    "/employee/update",
    employeeUpdateInfo
  );
};

export const getEmployeeInfoList = (
  employeeSearchForm?: EmployeeSearchForm
) => {
  return http.get<ResponseData<EmployeeTableData[]>>("/employee/query", {
    params: { form: employeeSearchForm ?? {} },
  });
};

export const getEmployeeSelection = async () => {
  const [gender, position, status] = await Promise.all([
    getSelectOptionByType2(DictDetailTypeEnum.GENDER),
    getSelectOptionByType2(DictDetailTypeEnum.POSITION),
    getSelectOptionByType2(DictDetailTypeEnum.STATUS),
  ]);

  return {
    gender: gender.data,
    position: position.data,
    status: status.data,
  };
};
