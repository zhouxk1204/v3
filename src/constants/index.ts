import { Option } from "@/components/Select/types";
import { TableHeader } from "@/components/Table/type";

export const HOLIDAYS: Option[] = [
  "元旦",
  "春节",
  "清明节",
  "劳动节",
  "端午节",
  "中秋节",
  "国庆节",
].map((e, i) => {
  return {
    key: `${i}`,
    label: e,
  };
});

export const HOLIDAY_ACTIONS: Option[] = ["补班", "放假"].map((e, i) => {
  return {
    key: `${i}`,
    label: e,
  };
});

export const GENDERS: Option[] = ["女性", "男性"].map((e, i) => {
  return {
    key: `${i}`,
    label: e,
  };
});

export const ROLES: Option[] = ["护士", "护士长"].map((e, i) => {
  return {
    key: `${i}`,
    label: e,
  };
});

export const STATES: Option[] = ["离职", "在职"].map((e, i) => {
  return {
    key: `${i}`,
    label: e,
  };
});

export const MODE_DIALOG = {
  CREATE: {
    key: "create",
    label: "添加",
  },
  UPDATE: {
    key: "update",
    label: "更新",
  },
};

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
