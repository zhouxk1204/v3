import { IDayRatioSetting } from "@/types";
import { defineStore } from "pinia";

const dayRatioSetting = defineStore(
  "dayRatioSetting",
  () => {
    const list = ref<IDayRatioSetting[]>([]);

    /**
     * 添加
     * @param {IDayRatioSetting} data
     */
    const insert = (data: IDayRatioSetting): boolean => {
      const isExist = list.value.some(
        (e) =>
          e.date === data.date &&
          e.employeeId === data.employeeId &&
          e.jobId === data.jobId &&
          e.ratio === data.ratio &&
          e.workTypeId === data.workTypeId
      );
      if (!isExist) {
        list.value.push(data);
        return true;
      } else {
        ElMessage.error("数据已存在，添加失败！");
        return false;
      }
    };

    /**
     * 删除
     * @param {number} index
     */
    const remove = (index: number): void => {
      if (index > -1) {
        list.value.splice(index, 1);
      } else {
        ElMessage.error("数据不存在，删除失败！");
      }
    };

    /**
     * 更新
     * @param {IDayRatioSetting} data
     */
    const update = (data: IDayRatioSetting): void => {
      const index = list.value.findIndex((e) => e.id === data.id);

      if (index > -1) {
        const l = list.value.filter(
          (e) =>
            e.date === data.date &&
            e.employeeId === data.employeeId &&
            e.jobId === data.jobId &&
            e.ratio === data.ratio &&
            e.workTypeId === data.workTypeId
        );

        if (l.length < 2) {
          list.value.splice(index, 1, data);
        } else {
          ElMessage.error("数据重复，更新失败！");
        }
      } else {
        ElMessage.error("数据不存在，更新失败！");
      }
    };
    return { list, insert, remove, update };
  },
  {
    persist: true,
  }
);
export default dayRatioSetting;
