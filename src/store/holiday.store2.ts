import { getHolidayList2 } from "@/api/holiday.api";
import { HolidayTableData } from "@/types/holiday";
import { defineStore } from "pinia";
import { ref } from "vue";

const useHolidayStore2 = defineStore("holiday2", () => {
  const holidayTempList = ref<HolidayTableData[]>([]);

  const setHolidayTempList = (list: HolidayTableData[]) => {
    holidayTempList.value = list;
  };

  const getHolidayTempList = async (): Promise<HolidayTableData[]> => {
    if (holidayTempList.value.length === 0) {
      const res = await getHolidayList2();
      setHolidayTempList(res.data);
    }
    return holidayTempList.value;
  };

  return {
    holidayTempList,
    getHolidayTempList,
    setHolidayTempList,
  };
});
export default useHolidayStore2;
