import { IHoliday } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const useHolidayStore = defineStore(
  "holiday",
  () => {
    const list = ref<IHoliday[]>([]);

    /**
     * 添加节假日
     * @param {IHoliday} holiday 待添加节假日
     */
    const insert = (holiday: IHoliday): void => {
      if (!list.value.find((e) => e.date === holiday.date)) {
        list.value.push(holiday);
        ElMessage.success("节假日信息添加成功！");
      } else {
        ElMessage.error("节假日信息信息已存在，添加失败！");
      }
    };

    /**
     * 删除某个节假日
     * @param {number} index
     */
    const remove = (index: number): void => {
      if (index > -1) {
        list.value.splice(index, 1);
        ElMessage.success("节假日信息删除成功！");
      } else {
        ElMessage.success("发生异常错误，节假日信息删除失败！");
      }
    };

    /**
     * 更新节假日列表
     * @param {IHoliday} data 待更新的节假日
     */
    const update = (data: IHoliday): void => {
      const index = list.value.findIndex((e) => e.id === data.id);

      if (index > -1) {
        const l = list.value.filter((e) => e.date === data.date);

        if (l.length < 2) {
          list.value.splice(index, 1, data);
          ElMessage.success("节假日信息更新成功！");
        } else {
          ElMessage.error("该日期已存在，节假日信息更新失败！");
        }
      } else {
        ElMessage.error("发生异常错误，节假日信息更新失败！");
      }
    };

    return { list, insert, remove, update };
  },
  {
    persist: true,
  }
);
export default useHolidayStore;
