import { ResponseData, http } from "../request";

import { SelectOption } from "./type";

export const getAllSelectOption = () => {
  return http.get<ResponseData<SelectOption[]>>("/selection/query");
};
