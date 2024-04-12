import { SelectOptionType } from "@/constants";
import useStore from "@/store";
import { IOption } from "@/types";

export function useSelect() {
  /**
   * 根据下拉框种别获取相应的列表
   * @param {selectOptionType} SelectOptionType 下拉框种别
   * @returns {IOption[]} 下拉框列表
   */
  const getOptionsByType = (optionType: SelectOptionType): IOption[] => {
    return useStore().selection.getSelectOptionByType(optionType);
  };

  /**
   * 根据下拉框种别获取相应的列表
   * @param {keyof IOption} key 选项的key
   * @param {IOption[keyof IOption]} value 选项的key对应的value
   * @param {SelectType} selectType 下拉框种别
   * @returns {IOption} 选项
   */
  const getOption = (
    key: keyof IOption,
    value: IOption[keyof IOption],
    type: SelectOptionType
  ): IOption | undefined => {
    const options = getOptionsByType(type);
    const option = options.find((e) => e[key] === value);
    return option;
  };

  return {
    getOptionsByType,
    getOption,
  };
}
