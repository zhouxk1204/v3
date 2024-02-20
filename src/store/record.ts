import { IRecord } from "@/models/report.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useRecordStore = defineStore(
  "record",
  () => {
    const list = ref<IRecord[][]>([]);

    /**
     * 设置
     * @param {IRecord[][]} data
     */
    const insert = (data: IRecord[][]): void => {
      list.value = data;
    };

    /**
     * 重制
     */
    const reset = (): void => {
      list.value = [];
    };

    return {
      list,
      reset,
      insert,
    };
  },
  {
    persist: true,
  }
);
export default useRecordStore;
