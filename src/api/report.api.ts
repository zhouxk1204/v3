import { ResponseData, http } from "./request";

import { IRecord } from "@/models/report.model";

export const updateRecords = (records: IRecord[]) => {
  return http.post<ResponseData<Object>>("/report/insert", records);
};

export const getRecordList = (month: string) => {
  return http.get<ResponseData<IRecord[]>>("/report/query", {
    params: { month },
  });
};
