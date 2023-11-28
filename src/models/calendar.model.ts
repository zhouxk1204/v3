export interface IDay {
  date: string;
  type: "0" | "1" | "2"; // 0: 工作日；1: 周末；2:法定节假日；3:补班
  typeName: "工作日" | "周末" | "法定节假日" | "补班";
  year: string; // 年份
  month: string; // 月份
  dayOfMonth: string; // 号数
  dayOfWeek: string; // 星期几 （0 代表星期日，1 代表星期一，以此类推）
}
