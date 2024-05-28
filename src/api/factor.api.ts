import { ResponseData, http } from "./request";

import { FactorTableData } from "@/types/factor";

export const getFactorList = (params?: Record<string, any>) => {
  return http.get<ResponseData<FactorTableData[]>>("/factor/query", {
    params: params ?? {},
  });
};

export const addFactorInfo = (body: Record<string, any>) => {
  return http.post<ResponseData<{}>>("/factor/insert", body);
};

export const deleteFactorInfo = (nos: number[]) => {
  return http.delete<ResponseData<{}>>("/factor/delete", {
    params: { nos },
  });
};

export const updateFactorInfo = (data: any) => {
  return http.post<ResponseData<Object>>("/factor/update", data);
};
