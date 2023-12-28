import { IRateSetting } from "@/models/report.model";
import { defineStore } from "pinia";
import { ref } from "vue";

const useRateSettingStore = defineStore(
  "rateSetting",
  () => {
    const rateSettingList = ref<IRateSetting[]>([]);

    /**
     * 添加
     * @param {IRateSetting} iRateSetting 待添加的工分倍率设定
     */
    const add = (iRateSetting: IRateSetting): void => {
      const index = rateSettingList.value.findIndex(
        (e) =>
          e.no === iRateSetting.no &&
          e.postId === iRateSetting.postId &&
          e.statusId === iRateSetting.statusId &&
          e.date === iRateSetting.date
      );
      if (index === -1) {
        iRateSetting.id = new Date().getTime().toString();
        rateSettingList.value.push(iRateSetting);
      }
    };

    /**
     * 删除
     * @param {string} id
     */
    const remove = (id: string): void => {
      const index = rateSettingList.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        rateSettingList.value.splice(index, 1);
      }
    };

    /**
     * 更新
     * @param {IRateSetting} iRateSetting 待更新的工分倍率设定
     */
    const update = (iRateSetting: IRateSetting): void => {
      const index = rateSettingList.value.findIndex(
        (e) => e.id === iRateSetting.id
      );
      if (index !== -1) {
        rateSettingList.value.splice(index, 1, iRateSetting);
      }
    };

    return { rateSettingList, add, remove, update };
  },
  {
    persist: true,
  }
);
export default useRateSettingStore;
