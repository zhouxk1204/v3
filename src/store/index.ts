import dayRatioSetting from "./dayRatioSetting";
import useEmployeeStore from "./employee.store";
import useHolidayStore from "./holiday.store";
import useRecordStore from "./record";
import useSelectionStore from "./selection";
import useUserStore from "./user.store";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    record: useRecordStore(),
    dayRatioSetting: dayRatioSetting(),
    selection: useSelectionStore(),
    user: useUserStore(),
  };
};
export default useStore;
