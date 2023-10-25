import { defineStore } from "pinia";
import { ref } from "vue";
import { Holiday } from "../models/holiday.model";

const useHolidayStore = defineStore(
  "holiday",
  () => {
    const holidayList = ref<Holiday[]>([]);

    /**
     * 添加节假日
     * @param {Holiday} holiday 待添加节假日
     */
    const add = (holiday: Holiday): void => {
      if (!holidayList.value.find((e) => e.date === holiday.date)) {
        holidayList.value.push(holiday);
      }
    };

    /**
     * 删除某个节假日
     * @param {string} date 日期
     */
    const remove = (date: string): void => {
      const index = holidayList.value.findIndex((e) => e.date === date);
      if (index !== -1) {
        holidayList.value.splice(index, 1);
      }
    };

    /**
     * 更新节假日列表
     * @param {Holiday} holiday 待更新的节假日
     */
    const update = (holiday: Holiday): void => {
      const index = holidayList.value.findIndex((e) => e.date === holiday.date);
      if (index !== -1) {
        holidayList.value.splice(index, 1, holiday);
      }
    };

    return { holidayList, add, remove, update };
  },
  {
    persist: true,
  }
);
export default useHolidayStore;
