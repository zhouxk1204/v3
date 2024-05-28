import { SelectOption, SelectType } from "@/types/common";
import { ResponseData, http } from "./request";

export const getSelectOptionByType = (type: SelectType) => {
  return http.get<ResponseData<SelectOption[]>>("/selection/query", {
    params: { type },
  });
};
