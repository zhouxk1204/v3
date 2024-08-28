/*
 * @Author: 周小康
 * @Date: 2024-08-26 14:17:15
 * @LastEditors: 周小康
 * @LastEditTime: 2024-08-28 16:17:42
 * @Description: 
 */
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
  employeeSearchForm: EmployeeSearchForm | {date: string} | undefined,
) => {
  return http.get<ResponseData<EmployeeTableData[]>>("/employee/query", {
    params:  employeeSearchForm ?? {}
  });
};

export const getEmployeeSelection = async () => {
  const [gender, position, status, title] = await Promise.all([
    getSelectOptionByType2(DictDetailTypeEnum.GENDER),
    getSelectOptionByType2(DictDetailTypeEnum.POSITION),
    getSelectOptionByType2(DictDetailTypeEnum.STATUS),
    getSelectOptionByType2(DictDetailTypeEnum.TITLE),
  ]);

  return {
    gender: gender.data,
    position: position.data,
    status: status.data,
    title: title.data
  };
};
