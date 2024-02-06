import { IEmployee, IHoliday } from "@/types";

import { TableColumnItem } from "@/components/Table/type";
import { useSelect } from "@/hooks/useSelect";

const { getOptionsByType } = useSelect();

export const HolidayTable: TableColumnItem<IHoliday>[] = [
  {
    field: "date",
    label: "日期",
    edit: {
      editType: "date",
      clearable: true,
      placeholder: "日期",
    },
  },
  {
    field: "holidayId",
    label: "节假日名称",
    edit: {
      editType: "select",
      clearable: true,
      placeholder: "节假日名称",
      selectType: "holiday",
      options: getOptionsByType("holiday"),
    },
  },
  {
    field: "holidayTypeId",
    label: "放假/补班",
    edit: {
      editType: "select",
      clearable: true,
      placeholder: "放假/补班",
      selectType: "holidayType",
      options: getOptionsByType("holidayType"),
    },
  },
  {
    field: "workRatio",
    label: "节假日补班工作倍率",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "节假日补班工作倍率",
    },
  },
  {
    field: "extraRatio",
    label: "节假日加班工作倍率",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "节假日加班工作倍率",
    },
  },
];

export const EmployeeTable: TableColumnItem<IEmployee>[] = [
  {
    field: "no",
    label: "顺序",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "顺序",
    },
  },
  {
    label: "姓名",
    field: "employeeName",
    edit: {
      editType: "text",
      clearable: true,
      placeholder: "姓名",
    },
  },
  {
    label: "系数",
    field: "factor",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "系数",
    },
  },
  {
    label: "性别",
    field: "genderId",
    edit: {
      editType: "select",
      selectType: "gender",
      options: getOptionsByType("gender"),
      clearable: true,
      placeholder: "性别",
    },
  },
  {
    label: "职位",
    field: "postId",
    edit: {
      editType: "select",
      selectType: "post",
      options: getOptionsByType("post"),
      clearable: true,
      placeholder: "职位",
    },
  },
];
