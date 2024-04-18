import { Employee } from "@/types/employee";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore = defineStore(
  "employee",
  () => {
    const employeeTempList = ref<Employee[]>([]);

    /**
     * 更新职工列表
     * @param {Employee} data 待更新的职工信息
     */
    const setEmployeeTempList = (list: Employee[]) => {
      employeeTempList.value = list;
    };

    return {
      employeeTempList,
      setEmployeeTempList,
    };
  },
  {
    persist: true,
  }
);
export default useEmployeeStore;
