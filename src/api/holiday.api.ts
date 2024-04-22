import { ResponseData, http } from "./request";

import { Holiday } from "@/types/holiday";

export const submitHoliday = (holiday: Holiday) => {
  return http.post("/holiday/insert", holiday);
};

export const getHolidayList = (params: { year: string; hId: string }) => {
  return http.get<ResponseData<Holiday[]>>("/holiday/query", {
    params: params,
  });
};

export const deleteHolidayById = (id: string) => {
  return http.delete<ResponseData<Object>>("/holiday/delete", {
    params: { id },
  });
};

export const updateHolidayData = (holiday: Holiday) => {
  return http.post<ResponseData<Object>>("/holiday/update", holiday);
};
