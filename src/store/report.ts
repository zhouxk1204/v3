import { IEmployeeReport } from "@/models/report.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useReportStore = defineStore(
  "report",
  () => {
    const iEmployeeReportList = ref<IEmployeeReport[]>([]);
    const reportDate = ref<string>("");
    const reportErrorList = ref<string[]>([]);

    const save = (data: IEmployeeReport[]): void => {
      iEmployeeReportList.value.push(...data);
    };

    const setReportDate = (date: string): void => {
      reportDate.value = date;
    };

    const addReportError = (error: string): void => {
      reportErrorList.value.push(error);
    };

    const clear = (): void => {
      reportDate.value = "";
      iEmployeeReportList.value = [];
    };

    return {
      iEmployeeReportList,
      reportDate,
      reportErrorList,
      save,
      clear,
      setReportDate,
      addReportError,
    };
  },
  {
    persist: true,
  }
);
export default useReportStore;
