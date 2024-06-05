import { SelectOption, SelectType } from "@/types/common";
import { ResponseData, http } from "./request";

export const getSelectOptionByType = (type: SelectType) => {
  return http.get<ResponseData<SelectOption[]>>("/selection/query", {
    params: { type },
  });
};

export const getSelectOptionByType2 = (type: SelectType) => {
  return http.get<ResponseData<SelectOption[]>>("/selection/query2", {
    params: { type },
  });
};
