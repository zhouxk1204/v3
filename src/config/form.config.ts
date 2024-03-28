import { FieldItem } from "@/components/Form/form";
import { SELECT_OPTION } from "@/constants";
import { useSelect } from "@/hooks/useSelect";

const { getOptionsByType } = useSelect();

export const HolidayForm: FieldItem[] = [
  {
    label: "日期",
    field: "date",
    type: "daterange",
    disableDate: () => false,
    rules: [
      {
        required: true,
        message: "请输入日期",
      },
    ],
    placeholder: "日期",
    clearable: true,
    dateRange: [],
    value: "",
  },
  {
    label: "节假日",
    field: "hId",
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择节假日",
      },
    ],
    options: getOptionsByType(SELECT_OPTION.HOLIDAY),
    placeholder: "节假日",
    clearable: true,
    value: "",
  },
  {
    label: "加班/补班",
    field: "tId",
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择加班/补班",
      },
    ],
    options: getOptionsByType(SELECT_OPTION.HOLIDAY_TYPE),
    placeholder: "加班/补班",
    clearable: true,
    value: "",
  },
  {
    label: "补班倍率",
    field: "ratio1",
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
    hidden: {
      key: "tId",
      value: "1",
    },
  },
  {
    label: "加班倍率",
    field: "ratio2",
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
  // {
  //   label: "姓名",
  //   field: "employeeId",
  //   type: "select",
  //   rules: [
  //     {
  //       required: true,
  //       message: "请选择姓名",
  //     },
  //   ],
  //   options: getOptionsByType("employee"),
  //   placeholder: "姓名",
  //   clearable: true,
  //   value: "",
  // },
  {
    label: "岗位",
    field: "jobId",
    type: "select",
    options: getOptionsByType(SELECT_OPTION.JOB),
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
    options: getOptionsByType(SELECT_OPTION.WORK_TYPE),
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

export const EmployeeForm: FieldItem[] = [
  {
    label: "顺序",
    field: "no",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入顺序",
      },
    ],
    placeholder: "顺序",
    clearable: true,
    value: "",
  },
  {
    label: "姓名",
    field: "name",
    type: "text",
    rules: [
      {
        required: true,
        message: "请输入姓名",
      },
    ],
    placeholder: "姓名",
    clearable: true,
    value: "",
  },
  {
    label: "系数",
    field: "factor",
    type: "number",
    rules: [
      {
        required: true,
        message: "请输入系数",
      },
    ],
    placeholder: "系数",
    clearable: true,
    value: "",
  },
  {
    label: "性别",
    field: "genderId",
    type: "select",
    options: getOptionsByType(SELECT_OPTION.GENDER),
    rules: [
      {
        required: true,
        message: "请选择性别",
      },
    ],
    placeholder: "性别",
    clearable: true,
    value: "",
  },
  {
    label: "职位",
    field: "positionId",
    type: "select",
    options: getOptionsByType(SELECT_OPTION.POSITION),
    rules: [
      {
        required: true,
        message: "请选择职位",
      },
    ],
    placeholder: "职位",
    clearable: true,
    value: "",
  },
  {
    label: "状态",
    field: "statusId",
    type: "select",
    options: getOptionsByType(SELECT_OPTION.STATUS),
    rules: [
      {
        required: true,
        message: "请选择状态",
      },
    ],
    placeholder: "状态",
    clearable: true,
    value: "",
  },
];
