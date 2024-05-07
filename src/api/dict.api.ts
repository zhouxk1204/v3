import {
  DictDetailForm,
  DictDetailSearchForm,
  DictDetailVO,
  DictForm,
  DictSearchForm,
  DictVO,
} from "@/types/dict";
import { ResponseData, http } from "./request";

export const addDictType = (dictForm: DictForm) => {
  return http.post("/dict/insert", dictForm);
};

export const addDictData = (dictDetailForm: DictDetailForm) => {
  return http.post("/dict/data/insert", dictDetailForm);
};

export const getDictTypeList = (params?: DictSearchForm | null) => {
  return http.get<ResponseData<DictVO[]>>("/dict/type/list", {
    params: params ?? {},
  });
};

export const getDictDataList = (params?: DictDetailSearchForm | null) => {
  return http.get<ResponseData<DictDetailVO[]>>("/dict/data/list", {
    params: params ?? {},
  });
};

export const deleteDictType = (dictIds: number[]) => {
  return http.delete<ResponseData<Object>>("/dict/type/delete", {
    params: { dictIds },
  });
};

export const deleteDictData = (dictCodes: number[]) => {
  return http.delete<ResponseData<Object>>("/dict/data/delete", {
    params: { dictCodes },
  });
};

export const updateDictType = (dictId: number, dictForm: DictForm) => {
  return http.post<ResponseData<Object>>(
    "/dict/type/update",
    Object.assign({ dictId }, dictForm)
  );
};
export const updateDictData = (
  dictCode: number,
  dictDetailForm: DictDetailForm
) => {
  return http.post<ResponseData<Object>>(
    "/dict/data/update",
    Object.assign({ dictCode }, dictDetailForm)
  );
};
