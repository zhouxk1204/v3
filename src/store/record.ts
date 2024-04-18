import { Record } from "@/types/report";
import { defineStore } from "pinia";
import { ref } from "vue";

const useRecordStore = defineStore(
  "record",
  () => {
    const list = ref<Record[][]>([]);

    /**
     * 设置
     * @param {Record[][]} data
     */
    const insert = (data: Record[][]): void => {
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
