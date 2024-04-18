import { SelectOptionType } from "@/constants";
import useStore from "@/store";

export interface Selection {
  label: string;
  value: string;
}

export function useSelect() {
  /**
   * 根据下拉框种别获取相应的列表
   * @param {selectOptionType} SelectOptionType 下拉框种别
   * @returns {Selection[]} 下拉框列表
   */
  const getOptionsByType = (optionType: SelectOptionType): Selection[] => {
    return useStore().selection.getSelectOptionByType(optionType);
  };

  /**
   * 根据下拉框种别获取相应的列表
   * @param {keyof Selection} key 选项的key
   * @param {Selection[keyof Selection]} value 选项的key对应的value
   * @param {SelectType} selectType 下拉框种别
   * @returns {Selection} 选项
   */
  const getOption = (
    key: keyof Selection,
    value: Selection[keyof Selection],
    type: SelectOptionType
  ): Selection | undefined => {
    const options = getOptionsByType(type);
    const option = options.find((e) => e[key] === value);
    return option;
  };

  return {
    getOptionsByType,
    getOption,
  };
}
