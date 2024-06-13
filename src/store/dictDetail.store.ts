import { SelectOption, SelectType } from "@/types/common";

import { getSelectOptionByType2 } from "@/api/common.api";
import { DictDetailTypeEnum } from "@/constants";
import { defineStore } from "pinia";
import { ref } from "vue";

const useDictDetailStore = defineStore("dictDetail", () => {
  const dictDetailTempMap = ref<Map<SelectType, SelectOption[]>>(new Map());

  const getDictTempListBySelectType = async (
    type: DictDetailTypeEnum
  ): Promise<SelectOption[]> => {
    const selectOptions = dictDetailTempMap.value.get(type) ?? [];
    if (selectOptions.length > 0) {
      return selectOptions;
    } else {
      const res = await getSelectOptionByType2(type);
      dictDetailTempMap.value.set(type, res.data);
      return res.data;
    }
  };

  return {
    dictDetailTempMap,
    getDictTempListBySelectType,
  };
});
export default useDictDetailStore;
