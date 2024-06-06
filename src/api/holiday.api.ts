import {
  Holiday,
  HolidayAddInfo,
  HolidaySearchForm2,
  HolidayTableData,
  HolidayUpdateInfo,
} from "@/types/holiday";
import { ResponseData, http } from "./request";

import { DictDetailVO } from "@/types/dict";

export const submitHoliday = (holiday: Holiday) => {
  return http.post("/holiday/insert", holiday);
};

export const getHolidayList = (params: HolidaySearchForm2) => {
  return http.get<ResponseData<HolidayTableData[]>>("/holiday/query", {
    params: params,
  });
};

export const getHolidayList2 = (params: HolidaySearchForm2 | undefined) => {
  return http.get<ResponseData<HolidayTableData[]>>("/holiday/query2", {
    params: params ?? {},
  });
};

export const addHolidayInfo = (body: HolidayAddInfo) => {
  return http.post<ResponseData<{}>>("/holiday/insert2", body);
};

export const getHolidayOptions = () => {
  return http.get<ResponseData<[DictDetailVO[], DictDetailVO[]]>>(
    "/holiday/optionselect"
  );
};

export const deleteHolidayById = (id: string) => {
  return http.delete<ResponseData<Object>>("/holiday/delete", {
    params: { id },
  });
};

export const updateHolidayData = (holiday: Holiday) => {
  return http.post<ResponseData<Object>>("/holiday/update", holiday);
};

export const deleteHolidayByNos = (nos: number[]) => {
  return http.delete<ResponseData<Object>>("/holiday/delete2", {
    params: { nos },
  });
};

export const updateHolidayInfo = (holiday: HolidayUpdateInfo) => {
  return http.post<ResponseData<Object>>("/holiday/update2", holiday);
};
