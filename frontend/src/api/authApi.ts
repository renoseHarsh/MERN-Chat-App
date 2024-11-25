import {
  ApiClientParams,
  LoginData,
  RegisterData,
  UserData,
} from "./types";
import { apiClient } from "./apiClient";

const authApi = "/auth";

export const loginUser = async (loginData: LoginData) => {
  const options: ApiClientParams<LoginData> = {
    url: `${authApi}/login`,
    method: "POST",
    data: loginData,
  };
  return await apiClient<LoginData, { data: UserData }>(options);
};

export const registerUser = async (registerData: RegisterData) => {
  const options: ApiClientParams<RegisterData> = {
    url: `${authApi}/register`,
    method: "POST",
    data: registerData,
  };
  return await apiClient<RegisterData, { data: UserData }>(options);
};

export const logoutUser = async () => {
  const options: ApiClientParams<undefined> = {
    url: `${authApi}/logout`,
    method: "GET",
  };
  return await apiClient<undefined, undefined>(options);
};
