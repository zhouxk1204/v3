import dayRatioSetting from "./dayRatioSetting";
import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";
import useRecordStore from "./record";
import useSelectionStore from "./selection";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    record: useRecordStore(),
    dayRatioSetting: dayRatioSetting(),
    selection: useSelectionStore(),
  };
};
export default useStore;
