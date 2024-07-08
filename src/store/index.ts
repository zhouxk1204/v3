import dayRatioSetting from "./dayRatioSetting";
import useDictDetailStore from "./dictDetail.store";
import useEmployeeStore2 from "./employee.store2";
import useHolidayStore2 from "./holiday.store2";
import useLoadingStore from "./loading";
import useRecordStore from "./record";
import useSelectionStore from "./selection";
import useUserStore from "./user.store";

const useStore = () => {
  return {
    holiday2: useHolidayStore2(),
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
