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

    return {
      holidayTempList,
      setHolidayTempList,
    };
  },
  {
    persist: true,
  }
);
export default useHolidayStore;
