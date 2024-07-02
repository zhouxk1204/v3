// 上班种别
export const WORK_TYPE_INFO = {
  WEEKDAY: {
    id: "w0",
    label: "工作日上班",
  },
  WEEKDAY_OVERTIME: {
    id: "w1",
    label: "工作日加班",
  },
  WEEKEND_OVERTIME: {
    id: "w2",
    label: "周末加班",
  },
  HOLIDAY: {
    id: "w3",
    label: "节假日加班",
  },
  MAKEUP: {
    id: "w4",
    label: "上班（补）",
  },
  MAKEUP_OVERTIME: {
    id: "w5",
    label: "加班（补）",
  },
};

export const REST_INFO = {
  LEAVE: {
    id: "r0",
    label: ["补休", "休"],
  },
  ANNUAL_LEAVE: {
    id: "r1",
    label: ["年休", "年假"],
  },
  PERSONAL_LEAVE: {
    id: "r2",
    label: ["事假"],
  },
  SICK_LEAVE: {
    id: "r3",
    label: ["病假"],
  },
  MARRIAGE_LEAVE: {
    id: "r4",
    label: ["婚假"],
  },
  MATERNITY_LEAVE: {
    id: "r5",
    label: ["产假"],
  },
  FUNERAL_LEAVE: {
    id: "r6",
    label: ["丧假"],
  },
  STUDY: {
    id: "r7",
    label: ["学习"],
  },
};

// 岗位
export const JOB_INFO = {
  OTHER: {
    id: "0",
    label: ["手术", "手"],
  },
  GASTROSCOPY: {
    id: "1",
    label: ["胃镜", "胃"],
  },
};

// 职位
export const POST_INFO = {
  NURSE: {
    id: "0",
    label: "护士",
  },
  HEAD_NURSE: {
    id: "1",
    label: "护士长",
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

export const RECORD_MARK = ["➕+", "／/"];

export const DAY_OF_WEEK = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

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

export const DEFAULT_WORK_RATIO = 1;
export const DEFAULT_OVERTIME_RATIO = 1.5;
export const DEFAULT_DATE_FORMAT = "YYYY/MM/DD";

// export const HOLIDAY_OVERTIME = "0";
// export const HOLIDAY_MAKEUP = "1";

export const TOKEN = "d8e21daefdd8a9353836c2cfecb4cd81";

export const AMAP_KEY = "6e530cf3ebaea4b2b08f359db5e6a072";

export const SELECT_OPTION = {
  GENDER: "0", // 性别
  POSITION: "1", // 职位
  STATUS: "2", // 状态
  JOB: "3", // 岗位
  WORK_TYPE: "4", // 上班种类：上班，加班
  HOLIDAY_TYPE: "5", // 节假日种类：补班，放假
  HOLIDAY: "6", // 节假日
} as const;

type ValueOf<T> = T[keyof T];

export type SelectOptionType = ValueOf<typeof SELECT_OPTION>;

export const ROUTE_WHITE_LIST = ["/map"];
export const ROUTE = {
  LOGIN: "/login",
  MAIN: "/main",
  REPORT: "/report",
  EMPLOYEE: "/employee",
  HOLIDAY: "/holiday",
};

export enum DictDetailTypeEnum {
  EMPLOYEE = "employee",
  GENDER = "1",
  POSITION = "2",
  STATUS = "3",
  HOLIDAY = "5",
  HOLIDAY_TYPE = "4",
  POST_INFO = "9",
  REST_INFO = "10",
}
