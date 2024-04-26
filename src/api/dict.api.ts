import { DictForm, DictSearchForm, DictVO } from "@/types/dict";
import { ResponseData, http } from "./request";

export const addDictType = (dictForm: DictForm) => {
  return http.post("/dict/insert", dictForm);
};

export const getDictTypeList = (params?: DictSearchForm | null) => {
  return http.get<ResponseData<DictVO[]>>("/dict/type/list", {
    params: params ?? {},
  });
};

export const deleteDictType = (dictIds: number[]) => {
  return http.delete<ResponseData<Object>>("/dict/type/delete", {
    params: { dictIds },
  });
};

export const updateDictType = (dictId: number, dictForm: DictForm) => {
  return http.post<ResponseData<Object>>(
    "/dict/type/update",
    Object.assign({ dictId }, dictForm)
  );
};
