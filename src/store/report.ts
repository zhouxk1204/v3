import { IEmployeeReport, IRecord } from "@/models/report.model";

import { defineStore } from "pinia";
import { ref } from "vue";

const useReportStore = defineStore(
  "report",
  () => {
    const iRecordList = ref<IRecord[][]>([]);

    const iEmployeeReportList = ref<IEmployeeReport[]>([]);
    const reportDate = ref<string>("");
    const reportErrorList = ref<string[]>([]);

    const saveIRecordList = (data: IRecord[][]): void => {
      iRecordList.value = data;
    };

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
      reportErrorList.value = [];
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
      iRecordList,
      saveIRecordList,
    };
  },
  {
    persist: true,
  }
);
export default useReportStore;
