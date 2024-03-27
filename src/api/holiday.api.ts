import { Holiday } from "@/types/holiday";
import { http } from "./request";

export const submitHoliday = (holiday: Holiday) => {
  return http.post("/holiday/insert", holiday);
};
