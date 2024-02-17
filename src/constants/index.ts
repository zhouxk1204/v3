import { CodeText } from "@/types";
import { Option } from "@/components/Select/types";

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

export const GENDERS: Option[] = ["女", "男"].map((e, i) => {
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

// export const WORK_STATUS: Option[] = ["上班", "加班"].map((e, i) => {
//   return {
//     code: `${i}`,
//     text: e,
//   };
// });

export const POST: Option[] = ["其他", "胃镜2"].map((e, i) => {
  return {
    code: `${i}`,
    text: e,
  };
});

// 当日属性
export const TYPE_DAY_OBJ: Record<string, CodeText> = {
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
  
};

export const WORK_INFO = {
  WORK: {
    id: "0",
    label: "上班",
  },
  OVERTIME: {
    id: "1",
    label: "加班",
  },
}

export const REST_INFO = {
  LEAVE: {
    id: "2",
    label: ["补休", "休"],
  },
  ANNUAL_LEAVE: {
    id: "3",
    label: ["年休", "年假"],
  },
  PERSONAL_LEAVE: {
    id: "4",
    label: ["事假"],
  },
  SICK_LEAVE: {
    id: "5",
    label: ["病假"],
  },
  MARRIAGE_LEAVE: {
    id: "6",
    label: ["婚假"],
  },
  MATERNITY_LEAVE: {
    id: "7",
    label: ["产假"],
  },
  FUNERAL_LEAVE: {
    id: "8",
    label: ["丧假"],
  },
};


// 岗位
export const POST_INFO = {
  ERROR: {
    id: "-1",
    label: ["错误"],
  },
  OTHER: {
    id: "0",
    label: ["手术", "手", ""],
  },
  GASTROSCOPY: {
    id: "1",
    label: ["胃镜", "胃"],
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

export const HOLIDAY_TYPE = {
  MAKEUP: "0",
  HOLIDAY: "1",
};

export const DAY_TYPE = {
  WEEKDAY: "0",
  WEEKEND: "1",
  HOLIDAY: "2",
  MAKEUP: "3",
};
