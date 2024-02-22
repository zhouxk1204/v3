import { IEmployee } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEmployeeStore = defineStore(
  "employee",
  () => {
    const list = ref<IEmployee[]>([]);
    /**
     * 添加职工
     * @param {IEmployee | IEmployee[]} employee 待添加职工
     */
    const insert = (employee: IEmployee | IEmployee[]): void => {
      const employeesToAdd = Array.isArray(employee) ? employee : [employee];
      let success = true;
      for (let item of employeesToAdd) {
        const employeeExists = list.value.some((e) => e.no === item.no);
        if (!employeeExists) {
          list.value.push(item);
        } else {
          if (success) {
            success = false;
          }
        }
      }

      if (success) {
        ElMessage.success("导入成功!");
      } else {
        ElMessage.error("员工信息重复，添加失败!");
      }
    };

    /**
     * 删除某个职工
     * @param {number} index
     */
    const remove = (index: number): void => {
      if (index > -1) {
        list.value.splice(index, 1);
        ElMessage.success("删除成功！");
      } else {
        ElMessage.success("发生异常错误，删除失败！");
      }
    };

    /**
     * 更新职工列表
     * @param {IEmployee} data 待更新的职工信息
     */
    const update = (data: IEmployee): void => {
      const index = list.value.findIndex((e) => e.id === data.id);

      if (index > -1) {
        const l = list.value.filter((e) => e.no === data.no);

        if (l.length < 2) {
          list.value.splice(index, 1, data);
          ElMessage.success("更新成功！");
        } else {
          ElMessage.error("员工序号重复，更新失败！");
        }
      } else {
        ElMessage.error("员工不存在，更新失败");
      }
    };

    const reset = () => {
      list.value = [];
      ElMessage.success("员工信息已清空！");
    };

    return { list, insert, remove, update, reset };
  },
  {
    persist: true,
  }
);
export default useEmployeeStore;
