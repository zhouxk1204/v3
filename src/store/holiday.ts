import { defineStore } from "pinia";
import { reactive } from "vue";
import { Holiday } from "./../models/holidayModel";

const useHolidayStore = defineStore("holiday", () => {
  const holidayList = reactive<Holiday[]>([]);

  /**
   * 添加节假日
   * @param {Holiday} holiday 待添加节假日
   */
  const add = (holiday: Holiday): void => {
    if (!holidayList.find((e) => e.date === holiday.date)) {
      holidayList.push(holiday);
    }
  };

  /**
   * 删除某个节假日
   * @param {string} date 日期
   */
  const remove = (date: string): void => {
    const index = holidayList.findIndex((e) => e.date === date);
    if (index !== -1) {
      holidayList.splice(index, 1);
    }
  };

  /**
   * 更新节假日列表
   * @param {Holiday} holiday 待更新的节假日
   */
  const update = (holiday: Holiday): void => {
    const index = holidayList.findIndex((e) => e.date === holiday.date);
    if (index !== -1) {
      holidayList.splice(index, 1, holiday);
    }
  };

  return { holidayList, add, remove, update };
});
export default useHolidayStore;
