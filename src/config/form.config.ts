import { FieldItem } from "@/components/Form/form";
import { useSelect } from "@/hooks/useSelect";
const { getOptionsByType } = useSelect();

export const HolidayForm: FieldItem[] = [
  {
    label: "日期",
    field: "date",
    type: "date",
    rules: [
      {
        required: true,
        message: "请输入日期",
      },
    ],
    placeholder: "日期",
    clearable: true,
    value: "",
  },
  {
    label: "节假日",
    field: "holidayId",
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择节假日",
      },
    ],
    options: getOptionsByType("holiday"),
    placeholder: "节假日",
    clearable: true,
    value: "",
  },
  {
    label: "加班/补班",
    field: "holidayTypeId",
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择加班/补班",
      },
    ],
    options: getOptionsByType("holidayType"),
    placeholder: "加班/补班",
    clearable: true,
    value: "",
  },
  {
    label: "节假日补班工分倍率",
    field: "workRatio",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入节假日补班工分倍率",
      },
    ],
    placeholder: "节假日补班工分倍率",
    clearable: true,
    value: "",
  },
  {
    label: "节假日加班工分倍率",
    field: "extraRatio",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入节假日加班工分倍率",
      },
    ],
    placeholder: "节假日加班工分倍率",
    clearable: true,
    value: "",
  },
];
