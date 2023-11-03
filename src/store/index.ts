import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";
import useReportStore from "./report";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
    report: useReportStore(),
  };
};
export default useStore;
