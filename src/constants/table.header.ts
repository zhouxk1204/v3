import { TableHeader } from "@/components/Table/type";

export const TABLE_HEADER_EMPLOYEE: TableHeader[] = [
  {
    key: "no",
    label: "顺序",
  },
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "factor",
    label: "系数",
  },
  {
    key: "gender",
    label: "性别",
  },
  {
    key: "state",
    label: "状态",
  },
  {
    key: "role",
    label: "职位",
  },
];

export const HOLIDAY_TABLE_HEADERS: TableHeader[] = [
  {
    key: "date",
    label: "日期",
  },
  {
    key: "name",
    label: "节假日名称",
  },
  {
    key: "typeName",
    label: "放假 Or 补班",
  },
  {
    key: "workWeight",
    label: "上班工分倍率",
  },
  {
    key: "extraWeight",
    label: "加班工分倍率",
  },
];

export const REPORT_TABLE_HEADERS: TableHeader[] = [
  {
    key: "employeeName",
    label: "姓名",
  },
  {
    key: "factor",
    label: "系数",
  },
  {
    key: "totalOtherRatioPoint",
    label: "其他岗位工分",
  },
  {
    key: "totalGastroscopyRatioPoint",
    label: "胃2岗位工分",
  },
  {
    key: "totalTimeRatioPoint",
    label: "时间总工分",
  },
  {
    key: "annual",
    label: "年休天数",
  },
  {
    key: "marriage",
    label: "婚假天数",
  },
  {
    key: "attendanceCount",
    label: "本月总出勤天数",
  },
  {
    key: "workdayCount",
    label: "工作日出勤天数",
  },
  {
    key: "serve",
    label: "科务天数",
  },
];

export const RECORD_RATE_SETTING = [
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "date",
    label: "日期",
  },
  {
    key: "postName",
    label: "岗位",
  },
  {
    key: "statusName",
    label: "上班 or 加班",
  },
  {
    key: "rate",
    label: "倍率",
  },
  {
    key: "remark",
    label: "备注",
  },
];
