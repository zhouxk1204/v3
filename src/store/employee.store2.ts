import { getEmployeeInfoList } from "@/api/employee.api";
import { EmployeeTableData } from "@/types/employee";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore2 = defineStore("employee2", () => {
  const employeeTempList = ref<EmployeeTableData[]>([]);

  const getEmployeeTempList = async (): Promise<EmployeeTableData[]> => {
    if (employeeTempList.value.length === 0) {
      const res = await getEmployeeInfoList();
      setEmployeeTempList(res.data);
    }
    return employeeTempList.value;
  };

  /**
   * 更新职工列表
   * @param {EmployeeTableData} list
   */
  const setEmployeeTempList = (list: EmployeeTableData[]) => {
    employeeTempList.value = list;
  };

  return {
    employeeTempList,
    getEmployeeTempList,
    setEmployeeTempList,
  };
});
export default useEmployeeStore2;
