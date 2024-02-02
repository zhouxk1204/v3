import { IHoliday } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const useHoliday2Store = defineStore(
  "holidayList2",
  () => {
    const list = ref<IHoliday[]>([]);

    /**
     * 添加节假日
     * @param {IHoliday} holiday 待添加节假日
     */
    const handleInsert = (holiday: IHoliday): boolean => {
      if (!list.value.find((e) => e.date === holiday.date)) {
        list.value.push(holiday);
        return true;
      } else {
        ElMessage.error("当日信息已存在");
        return false;
      }
    };

    /**
     * 删除某个节假日
     * @param {number} id uuid
     */
    const handleRemove = (id: number): void => {
      const index = list.value.findIndex((e) => e.id === id);
      if (index > -1) {
        list.value.splice(index, 1);
      }
    };

    /**
     * 更新节假日列表
     * @param {IHoliday} holiday 待更新的节假日
     */
    const handleUpdate = (holiday: IHoliday): void => {
      const index = list.value.findIndex((e) => e.id === holiday.id);

      if (index > -1) {
        const index2 = list.value.findIndex((e) => e.date === holiday.date);

        if (index2 === -1) {
          list.value.splice(index, 1, holiday);
        }
      }
    };

    return { list, handleInsert, handleRemove, handleUpdate };
  },
  {
    persist: true,
  }
);
export default useHoliday2Store;
