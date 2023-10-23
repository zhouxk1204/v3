import useHolidayStore from "./holiday";

const useStore = () => {
  return {
    holiday: useHolidayStore(),
  };
};
export default useStore;
