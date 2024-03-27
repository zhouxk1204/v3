import { Employee } from "@/types/employee";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore = defineStore(
  "employee",
  () => {
    const employeeTempList = ref<Employee[]>([]);

    /**
     * 更新职工列表
     * @param {IEmployee} data 待更新的职工信息
     */
    const setEmployeeTempList = (list: Employee[]) => {
      employeeTempList.value = list;
    };

    const getEmployeeTempList = () => {
      return employeeTempList.value;
    };

    const updateEmployee = (employee: Employee) => {
      const index = employeeTempList.value.findIndex(
        (e) => e.id === employee.id
      );
      if (index > -1) {
        employeeTempList.value.splice(index, 1, employee);
      }
    };

    const resetEmployeeList = () => {
      employeeTempList.value = [];
    };

    return {
      getEmployeeTempList,
      setEmployeeTempList,
      updateEmployee,
      resetEmployeeList,
    };
  },
  {
    persist: true,
  }
);
export default useEmployeeStore;
