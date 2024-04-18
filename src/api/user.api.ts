import { ResponseData, http } from "./request";

import { User } from "@/types/user";

export const updateUser = (user: User) => {
  return http.post<ResponseData<Object>>("/user/update", user);
};
