import { SelectOption } from "@/api/common/type";
import { SelectOptionType } from "@/constants";
import { defineStore } from "pinia";

const useSelectionStore = defineStore(
  "selection",
  () => {
    const selectionList = ref<SelectOption[]>([]);

    const setSelectOptionList = (selectOptionList: SelectOption[]) => {
      selectionList.value = selectOptionList;
    };

    const getSelectOptionByType = (type: SelectOptionType) => {
      return selectionList.value
        .filter((el) => el.type === type)
        .map((el) => {
          return {
            value: el.code,
            label: el.label,
          };
        });
    };

    return {
      selectionList,
      getSelectOptionByType,
      setSelectOptionList,
    };
  },
  {
    persist: true,
  }
);

export default useSelectionStore;
