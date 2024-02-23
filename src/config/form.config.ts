import { FieldItem } from "@/components/Form/form";
import { useSelect } from "@/hooks/useSelect";
const { getOptionsByType } = useSelect();

export const HolidayForm: FieldItem[] = [
  {
    label: "节假日日期",
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
    label: "节假日名称",
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
    label: "补班倍率",
    field: "workRatio",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入节假日补班工分倍率",
      },
    ],
    placeholder: "补班工分倍率",
    clearable: true,
    value: "",
  },
  {
    label: "加班倍率",
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

export const DayRatioSettingForm: FieldItem[] = [
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
    label: "姓名",
    field: "employeeId",
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择姓名",
      },
    ],
    options: getOptionsByType("employee"),
    placeholder: "姓名",
    clearable: true,
    value: "",
  },
  {
    label: "岗位",
    field: "jobId",
    type: "select",
    options: getOptionsByType("job"),
    rules: [
      {
        required: true,
        message: "请选择岗位",
      },
    ],
    placeholder: "岗位",
    clearable: true,
    value: "",
  },
  {
    label: "上班/加班",
    field: "workTypeId",
    type: "select",
    options: getOptionsByType("workType"),
    rules: [
      {
        required: true,
        message: "请选择上班/加班",
      },
    ],
    placeholder: "上班/加班",
    clearable: true,
    value: "",
  },
  {
    label: "工分倍率",
    field: "ratio",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入工分倍率",
      },
    ],
    placeholder: "工分倍率",
    clearable: true,
    value: "",
  },
  {
    label: "备注",
    field: "remark",
    type: "text",
    rules: [
      {
        required: true,
        message: "请输入备注",
      },
    ],
    placeholder: "备注",
    clearable: true,
    value: "",
  },
];
