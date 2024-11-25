import { apiClient } from "./apiClient";
import { ApiClientParams, UserData, UserSearchData } from "./types";

const userApi = "/user";

export const getUserDetails = async () => {
  const options: ApiClientParams<undefined> = {
    url: `${userApi}/me`,
    method: "GET",
  };
  return await apiClient<undefined, { data: UserData }>(options);
};

export const getUsersBySearch = async (search: string) => {
  const options: ApiClientParams<undefined> = {
    url: `${userApi}/search?q=${search}`,
    method: "GET",
  };
  return await apiClient<undefined, UserSearchData>(options);
};
