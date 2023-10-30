import { Option } from "@/components/Select/types";
import { IDayType } from "@/types";

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

export const DAY_TYPE_OBJ: Record<string, IDayType> = {
  WEEKDAY_WORK: {
    typeId: "0",
    typeName: "工作日上班",
  },
  WEEKEND_OVERTIME: {
    typeId: "1",
    typeName: "周末加班",
  },
  HOLIDAY_OVERTIME: {
    typeId: "2",
    typeName: "节假日上班",
  },
};

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

export const RECORD_MARK = ["➕+"];
