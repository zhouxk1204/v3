import { TableColumnItem } from "@/components/Table/type";
import { SELECT_OPTION } from "@/constants";
import { useSelect } from "@/hooks/useSelect";
import { IDayRatioSetting } from "@/types";
import { Employee } from "@/types/employee";
import { Holiday } from "@/types/holiday";
import { Report } from "@/types/report";

const { getOptionsByType } = useSelect();

export const HolidayTable: TableColumnItem<Holiday>[] = [
  {
    field: "date",
    label: "日期",
    edit: {
      editType: "daterange",
      clearable: true,
      placeholder: "日期",
    },
  },
  {
    field: "hId",
    label: "名称",
    edit: {
      editType: "select",
      clearable: true,
      placeholder: "节假日名称",
      selectType: SELECT_OPTION.HOLIDAY,
      options: getOptionsByType(SELECT_OPTION.HOLIDAY),
    },
  },
  {
    field: "tId",
    label: "放假/补班",
    edit: {
      editType: "select",
      clearable: true,
      placeholder: "放假/补班",
      selectType: SELECT_OPTION.HOLIDAY_TYPE,
      options: getOptionsByType(SELECT_OPTION.HOLIDAY_TYPE),
    },
  },
  {
    field: "ratio1",
    label: "补班倍率",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "补班倍率",
    },
  },
  {
    field: "ratio2",
    label: "加班倍率",
    edit: {
      editType: "number",
      clearable: true,
      placeholder: "加班倍率",
    },
  },
];

export const EmployeeTable: TableColumnItem<Employee>[] = [
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
    field: "name",
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
      selectType: SELECT_OPTION.GENDER,
      options: getOptionsByType(SELECT_OPTION.GENDER),
      clearable: true,
      placeholder: "性别",
    },
  },
  {
    label: "职位",
    field: "positionId",
    edit: {
      editType: "select",
      selectType: SELECT_OPTION.POSITION,
      options: getOptionsByType(SELECT_OPTION.POSITION),
      clearable: true,
      placeholder: "职位",
    },
  },
  {
    label: "状态",
    field: "statusId",
    edit: {
      editType: "select",
      selectType: SELECT_OPTION.STATUS,
      options: getOptionsByType(SELECT_OPTION.STATUS),
      clearable: true,
      placeholder: "状态",
    },
  },
];

export const DayRatioSettingTable: TableColumnItem<IDayRatioSetting>[] = [
  // {
  //   field: "employeeId",
  //   label: "姓名",
  //   edit: {
  //     editType: "select",
  //     clearable: true,
  //     placeholder: "姓名",
  //     selectType: "employee",
  //     options: getOptionsByType("employee"),
  //   },
  // },
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
      selectType: SELECT_OPTION.JOB,
      options: getOptionsByType(SELECT_OPTION.JOB),
      clearable: true,
      placeholder: "岗位",
    },
  },
  {
    label: "上班/加班",
    field: "workTypeId",
    edit: {
      editType: "select",
      selectType: SELECT_OPTION.WORK_TYPE,
      options: getOptionsByType(SELECT_OPTION.WORK_TYPE),
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

export const ReportTable: TableColumnItem<Report>[] = [
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
    label: "手术上班工分",
  },
  {
    field: "totalOvertimeOther",
    label: "手术加班工分",
  },
  {
    field: "totalOther",
    label: "手术总工分",
  },
  {
    field: "totalWorkGastroscopy",
    label: "胃2上班工分",
  },
  {
    field: "totalOvertimeGastroscopy",
    label: "胃2加班工分",
  },
  {
    field: "totalGastroscopy",
    label: "胃2总工分",
  },
  {
    field: "total",
    label: "时间总工分",
  },
  {
    field: "annual",
    label: "年休(天)",
  },
  {
    field: "leave",
    label: "补休(天)",
  },
  {
    field: "workDayCount",
    label: "工作日(天)",
  },
  {
    field: "workCount",
    label: "出勤(天)",
  },
  {
    field: "serve",
    label: "科务(天)",
  },
];
