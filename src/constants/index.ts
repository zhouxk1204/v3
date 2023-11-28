import { Option } from "@/components/Select/types";
import { CodeText } from "@/types";

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
    code: `${i}`,
    text: e,
  };
});

export const HOLIDAY_ACTIONS: Option[] = ["补班", "放假"].map((e, i) => {
  return {
    code: `${i}`,
    text: e,
  };
});

export const GENDERS: Option[] = ["女性", "男性"].map((e, i) => {
  return {
    code: `${i}`,
    text: e,
  };
});

export const ROLES: Option[] = ["护士", "护士长"].map((e, i) => {
  return {
    code: `${i}`,
    text: e,
  };
});

export const STATES: Option[] = ["离职", "在职"].map((e, i) => {
  return {
    code: `${i}`,
    text: e,
  };
});

// 当日属性
export const TYPE_DAY_OBJ: Record<string, CodeText> = {
  UNKNOWN: {
    code: "-1",
    text: "未知",
  },
  WEEKDAY: {
    code: "0",
    text: "工作日上班",
  },
  WEEKEND: {
    code: "1",
    text: "周末加班",
  },
  HOLIDAY: {
    code: "2",
    text: "节假日加班",
  },
  MAKEUP: {
    code: "3",
    text: "节假日补班",
  },
};

// 工分种别
export const TYPE_POINT_OBJ = {
  ATTENDANCE: {
    WORK: {
      code: "0",
      text: "上班",
    },
    OVERTIME: {
      code: "1",
      text: "加班",
    },
  },
  REST: {
    LEAVE: {
      code: "2",
      text: ["补休", "休"],
    },
    ANNUAL_LEAVE: {
      code: "3",
      text: ["年休", "年假"],
    },
    PERSONAL_LEAVE: {
      code: "4",
      text: "事假",
    },
    SICK_LEAVE: {
      code: "5",
      text: "病假",
    },
    MARRIAGE_LEAVE: {
      code: "6",
      text: "婚假",
    },
    MATERNITY_LEAVE: {
      code: "7",
      text: "产假",
    },
    FUNERAL_LEAVE: {
      code: "8",
      text: "丧假",
    },
  },
};

// 岗位
export const TYPE_POST_OBJ = {
  OTHER: {
    code: "0",
    text: ["手术", "手"],
  },
  GASTROSCOPY: {
    code: "1",
    text: ["胃镜", "胃"],
  },
};

export const MODE_DIALOG = {
  CREATE: {
    code: "create",
    text: "添加",
  },
  UPDATE: {
    code: "update",
    text: "更新",
  },
};

export const DEFAULT = {
  RATIO: {
    WORK: 1,
    OVERTIME: 1.5,
  },
  DATE_FORMAT: "YYYY/MM/DD",
};

export const RECORD_MARK = ["➕+"];

export const DAY_OF_WEEK = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

export const DATE_FORMAT = "YYYY/MM/DD";
