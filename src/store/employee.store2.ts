/*
 * @Author: 周小康
 * @Date: 2024-08-20 20:27:30
 * @LastEditors: 周小康
 * @LastEditTime: 2024-08-28 16:18:32
 * @Description: 
 */
import { EmployeeTableData } from "@/types/employee";
import { defineStore } from "pinia";
import { getEmployeeInfoList } from "@/api/employee.api";
import { ref } from "vue";

const useEmployeeStore2 = defineStore("employee2", () => {
  const employeeTempList = ref<Map<string, EmployeeTableData[]>>(new Map());

  const getEmployeeTempList = async (yearMonth: string): Promise<EmployeeTableData[]> => {
    if (!employeeTempList.value.has(yearMonth)) {
      const res = await getEmployeeInfoList({date: yearMonth});
      employeeTempList.value.set(yearMonth, res.data);
    }
    return employeeTempList.value.get(yearMonth)!;
  };

  return {
    employeeTempList,
    getEmployeeTempList,
  };
});
export default useEmployeeStore2;
