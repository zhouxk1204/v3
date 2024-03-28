import { Holiday } from "@/types/holiday";
import { defineStore } from "pinia";
import { ref } from "vue";

const useHolidayStore = defineStore(
  "holiday",
  () => {
    const holidayTempList = ref<Holiday[]>([]);

    const setHolidayTempList = (list: Holiday[]) => {
      holidayTempList.value = list;
    };

    const getHolidayTempList = () => {
      return holidayTempList.value;
    };

    const updateHoliday = (employee: Holiday) => {
      const index = holidayTempList.value.findIndex(
        (e) => e.id === employee.id
      );
      if (index > -1) {
        holidayTempList.value.splice(index, 1, employee);
      }
    };

    const resetHolidayList = () => {
      holidayTempList.value = [];
    };

    return {
      setHolidayTempList,
      getHolidayTempList,
      updateHoliday,
      resetHolidayList,
    };
  },
  {
    persist: true,
  }
);
export default useHolidayStore;
