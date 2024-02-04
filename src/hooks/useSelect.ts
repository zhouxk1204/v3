import { IOption, SelectType } from "@/types";

export function useSelect() {
  const OptionsObject: { [K in SelectType]: IOption[] } = {
    // 性别
    gender: [
      {
        label: "女",
        value: "0",
      },
      {
        label: "男",
        value: "1",
      },
    ],
    // 职位
    post: [
      {
        label: "护士",
        value: "0",
      },
      {
        label: "护士长",
        value: "1",
      },
    ],
    // 岗位
    job: [
      {
        label: "胃镜1",
        value: "0",
      },
      {
        label: "胃镜2",
        value: "1",
      },
      {
        label: "胃镜3",
        value: "2",
      },
      {
        label: "手术1",
        value: "3",
      },
      {
        label: "手术2",
        value: "4",
      },
      {
        label: "手术3",
        value: "5",
      },
      {
        label: "机动",
        value: "6",
      },
      {
        label: "其他",
        value: "7",
      },
    ],
    // 上班类别
    work: [
      {
        label: "上班",
        value: "0",
      },
      {
        label: "加班",
        value: "1",
      },
    ],
    // 节假日
    holiday: [
      {
        label: "元旦",
        value: "0",
      },
      {
        label: "春节",
        value: "1",
      },
      {
        label: "清明节",
        value: "2",
      },
      {
        label: "劳动节",
        value: "3",
      },
      {
        label: "端午节",
        value: "4",
      },
      {
        label: "中秋节",
        value: "5",
      },
      {
        label: "国庆节",
        value: "6",
      },
    ],
    // 节假日类型
    holidayType: [
      {
        label: "补班",
        value: "0",
      },
      {
        label: "放假",
        value: "1",
      },
    ],
  };

  /**
   * 根据下拉框种别获取相应的列表
   * @param {SelectType} selectType 下拉框种别
   * @returns {IOption[]} 下拉框列表
   */
  const getOptionsByType = (selectType: SelectType): IOption[] => {
    return OptionsObject[selectType];
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
    type: SelectType
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
