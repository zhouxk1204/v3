import { LoginReq, LoginRes } from "./type";

import { http } from "../request";

export const login = (loginReq: LoginReq) => {
  return http.post<LoginRes>("/register", loginReq);
};
