import { ResponseData, http } from "./request";

import { User } from "@/models/user.model";

export const updateUser = (user: User) => {
  return http.post<ResponseData<Object>>("/user/update", user);
};
