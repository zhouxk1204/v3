import { IEmployee } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore2 = defineStore(
  "employee2",
  () => {
    const list = ref<IEmployee[]>([]);

    /**
     * 添加职工
     * @param {IEmployee | IEmployee[]} employee 待添加职工
     */
    const handleInsert = (employee: IEmployee | IEmployee[]): void => {
      const employeesToAdd = Array.isArray(employee) ? employee : [employee];

      employeesToAdd.forEach((item) => {
        const employeeExists = list.value.some((e) => e.no === item.no);
        if (!employeeExists) {
          list.value.push(item);
        }
      });
    };

    /**
     * 删除某个职工
     * @param {number} id id
     */
    const handleRemove = (id: number): void => {
      const index = list.value.findIndex((e) => e.id === id);
      if (index > -1) {
        list.value.splice(index, 1);
      }
    };

    /**
     * 更新职工列表
     * @param {IEmployee} employee 待更新的职工
     */
    const handleUpdate = (employee: IEmployee): void => {
      const index = list.value.findIndex((e) => e.id === employee.id);

      if (index > -1) {
        const index2 = list.value.findIndex((e) => e.no === employee.no);

        if (index2 === -1) {
          list.value.splice(index, 1, employee);
        }
      }
    };

    return { list, handleInsert, handleRemove, handleUpdate };
  },
  {
    persist: true,
  }
);
export default useEmployeeStore2;
