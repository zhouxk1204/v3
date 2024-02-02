import useDayRatio from "./dayRatio";
import useEmployeeStore from "./employee";
import useEmployeeStore2 from "./employee2";
import useHolidayStore from "./holiday";
import useHoliday2Store from "./holiday2";
import useRateSettingStore from "./rateSetting";
import useReportStore from "./report";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    holiday2: useHoliday2Store(),
    employee: useEmployeeStore(),
    employee2: useEmployeeStore2(),
    report: useReportStore(),
    dayRatio: useDayRatio(),
    rateSetting: useRateSettingStore(),
  };
};
export default useStore;
