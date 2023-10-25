import useEmployeeStore from "./employee";
import useHolidayStore from "./holiday";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
    employee: useEmployeeStore(),
  };
};
export default useStore;
