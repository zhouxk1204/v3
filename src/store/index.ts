import dayRatioSetting from "./dayRatioSetting";
import useDictDetailStore from "./dictDetail.store";
import useEmployeeStore from "./employee.store";
import useEmployeeStore2 from "./employee.store2";
import useHolidayStore from "./holiday.store";
import useHolidayStore2 from "./holiday.store2";
import useLoadingStore from "./loading";
import useRecordStore from "./record";
import useSelectionStore from "./selection";
import useUserStore from "./user.store";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    holiday2: useHolidayStore2(),
    employee: useEmployeeStore(),
    employee2: useEmployeeStore2(),
    record: useRecordStore(),
    dayRatioSetting: dayRatioSetting(),
    selection: useSelectionStore(),
    user: useUserStore(),
    loading: useLoadingStore(),
    dictDetail: useDictDetailStore(),
  };
};
export default useStore;
