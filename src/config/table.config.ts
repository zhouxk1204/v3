import { IDayRatioSetting, IEmployee, IHoliday, IReport } from "@/types";

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

export const DayRatioSettingTable: TableColumnItem<IDayRatioSetting>[] = [
  {
    field: "employeeId",
    label: "姓名",
    edit: {
      editType: "select",
      clearable: true,
      placeholder: "姓名",
      selectType: "employee",
      options: getOptionsByType("employee"),
    },
  },
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
    label: "岗位",
    field: "jobId",
    edit: {
      editType: "select",
      selectType: "job",
      options: getOptionsByType("job"),
      clearable: true,
      placeholder: "岗位",
    },
  },
  {
    label: "上班/加班",
    field: "workTypeId",
    edit: {
      editType: "select",
      selectType: "workType",
      options: getOptionsByType("workType"),
      clearable: true,
      placeholder: "岗位",
    },
  },
  {
    label: "工分倍率",
    field: "ratio",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "工分倍率",
    },
  },
  {
    label: "备注",
    field: "remark",
    edit: {
      editType: "text",
      clearable: true,
      placeholder: "remark",
    },
  },
];

export const ReportTable: TableColumnItem<IReport>[] = [
  {
    field: "employeeName",
    label: "姓名",
  },
  {
    field: "factor",
    label: "系数",
  },
  {
    field: "totalWorkOther",
    label: "其他岗位上班工分",
  },
  {
    field: "totalOvertimeOther",
    label: "其他岗位加班工分",
  },
  {
    field: "totalOther",
    label: "其他岗位总工分",
  },
  {
    field: "totalWorkGastroscopy",
    label: "胃2岗位上班工分",
  },
  {
    field: "totalOvertimeGastroscopy",
    label: "胃2岗位加班工分",
  },
  {
    field: "totalGastroscopy",
    label: "胃2岗位总工分",
  },
  {
    field: "total",
    label: "时间总工分",
  },
  {
    field: "annual",
    label: "年休天数",
  },
  {
    field: "leave",
    label: "休假天数",
  },
  {
    field: "workDayCount",
    label: "本月工作日天数",
  },
  {
    field: "workCount",
    label: "本月出勤天数",
  },
  {
    field: "serve",
    label: "科务天数",
  },
];
