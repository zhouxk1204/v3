import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";
import useRateSettingStore from "./rateSetting";
import useReportStore from "./report";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    report: useReportStore(),
    rateSetting: useRateSettingStore(),
  };
};
export default useStore;
