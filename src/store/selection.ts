import { SelectOption } from "@/api/common/type";
import { SelectOptionType } from "@/constants";
import { defineStore } from "pinia";

const useSelectionStore = defineStore(
  "selection",
  () => {
    const list = ref<SelectOption[]>([]);

    const setSelectOptionList = (selectOptionList: SelectOption[]) => {
      list.value = selectOptionList;
    };

    const getSelectOptionByType = (type: SelectOptionType) => {
      return list.value
        .filter((el) => el.type === type)
        .map((el) => {
          return {
            value: el.code,
            label: el.label,
          };
        });
    };

    return {
      list,
      getSelectOptionByType,
      setSelectOptionList,
    };
  },
  {
    persist: true,
  }
);

export default useSelectionStore;
