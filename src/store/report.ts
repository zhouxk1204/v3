import { IRecord } from "@/models/report.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useReportStore = defineStore(
  "report",
  () => {
    const iRecordList = ref<IRecord[][]>([]);
    const setIRecordList = (data: IRecord[][]): void => {
      iRecordList.value = data;
    };

    const getIRecordList = (): IRecord[][] => {
      return iRecordList.value;
    };

    const clear = (): void => {
      iRecordList.value = [];
    };

    return {
      clear,
      setIRecordList,
      getIRecordList,
    };
  },
  {
    persist: true,
  }
);
export default useReportStore;
