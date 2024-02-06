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
    const insert = (holiday: IHoliday): boolean => {
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
     * @param {number} index
     */
    const remove = (index: number): void => {
      if (index > -1) {
        list.value.splice(index, 1);
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
        } else {
          ElMessage.error("节假日日期重复，更新失败！");
        }
      } else {
        ElMessage.error("节假日不存在，更新失败！");
      }
    };

    return { list, insert, remove, update };
  },
  {
    persist: true,
  }
);
export default useHoliday2Store;
