import { ResponseData, http } from "./request";

import { Record } from "@/types/report";

export const updateRecords = (records: Record[]) => {
  return http.post<ResponseData<Object>>("/report/insert", records);
};

export const getRecordList = (month: string) => {
  return http.get<ResponseData<Record[]>>("/report/query", {
    params: { month },
  });
};

export const getBarChartList = (month: string) => {
  return http.get<ResponseData<any[]>>("/report/bar", {
    params: { month },
  });
};
