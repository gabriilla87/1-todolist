import { instance } from "common/instance/instance";
import { AuthMeDataType, LoginParamsType } from "features/auth/api/authAPI.types";
import { CommonResponse } from "common/types/types";

export const authAPI = {
  login({ email, password, rememberMe, captcha = false }: LoginParamsType) {
    return instance.post<CommonResponse<{ userId: number }>>("/auth/login", {
      email,
      password,
      rememberMe,
      captcha,
    });
  },
  me() {
    return instance.get<CommonResponse<AuthMeDataType>>("/auth/me");
  },
  logout() {
    return instance.delete<CommonResponse>("auth/login");
  },
};
