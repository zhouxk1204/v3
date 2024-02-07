import dayRatioSetting from "./dayRatioSetting";
import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";
import useReportStore from "./report";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    report: useReportStore(),
    dayRatioSetting: dayRatioSetting(),
  };
};
export default useStore;
