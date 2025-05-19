/*
 * @Author: 周小康
 * @Date: 2024-08-20 20:27:30
 * @LastEditors: 周小康
 * @LastEditTime: 2025-05-19 13:36:15
 * @Description:
 */
import { getEmployeeInfoList } from "@/api/employee.api";
import { EmployeeTableData } from "@/types/employee";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore2 = defineStore("employee2", () => {
  const employeeTempList = ref<Map<string, EmployeeTableData[]>>(new Map());

  const getEmployeeTempList = async (
    yearMonth: string
  ): Promise<EmployeeTableData[]> => {
    if (!employeeTempList.value.has(yearMonth)) {
      const res = await getEmployeeInfoList({ date: yearMonth });
      console.log("%c Line:19 🥓 res", "color:#fca650", res);
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
