import { IEmployeeReport } from "@/models/report.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useReportStore = defineStore(
  "report",
  () => {
    const iEmployeeReportList = ref<IEmployeeReport[]>([]);

    const save = (data: IEmployeeReport[]): void => {
      iEmployeeReportList.value.push(...data);
    };

    return { iEmployeeReportList, save };
  },
  {
    persist: true,
  }
);
export default useReportStore;
