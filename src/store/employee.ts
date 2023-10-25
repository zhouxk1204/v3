import { Employee } from "@/models/employee.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore = defineStore(
  "employee",
  () => {
    const employeeList = ref<Employee[]>([]);

    /**
     * 添加职工
     * @param {Employee} employee 待添加职工
     */
    const add = (employee: Employee): void => {
      if (!employeeList.value.find((e) => e.no === employee.no)) {
        employeeList.value.push(employee);
      }
    };

    /**
     * 添加职工列表
     * @param {Employee[]} list 待添加职工列表
     */
    const addList = (list: Employee[]): void => {
      list.forEach((item) => {
        if (!employeeList.value.find((e) => e.no === item.no)) {
          employeeList.value.push(item);
        }
      });
    };

    /**
     * 删除某个职工
     * @param {string} no 顺序
     */
    const remove = (no: string): void => {
      const index = employeeList.value.findIndex((e) => e.no === no);
      if (index !== -1) {
        employeeList.value.splice(index, 1);
      }
    };

    /**
     * 更新职工列表
     * @param {Employee} employee 待更新的职工
     */
    const update = (employee: Employee): void => {
      const index = employeeList.value.findIndex((e) => e.no === employee.no);
      if (index !== -1) {
        employeeList.value.splice(index, 1, employee);
      }
    };

    return { employeeList, add, addList, remove, update };
  },
  {
    persist: true,
  }
);
export default useEmployeeStore;
