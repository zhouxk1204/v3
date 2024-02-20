import dayRatioSetting from "./dayRatioSetting";
import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";
import useRecordStore from "./record";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    record: useRecordStore(),
    dayRatioSetting: dayRatioSetting(),
  };
};
export default useStore;
