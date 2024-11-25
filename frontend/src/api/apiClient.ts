import { ApiClientParams, ApiResponse } from "./types";

export const BASE_URL =
  import.meta.env.MODE == "development" ? "http://0.0.0.0:5002/api" : "/api";

export const apiClient = async <T, R>({
  url,
  method,
  data,
}: ApiClientParams<T>): Promise<R & ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    const responseData: R & { message: string } = await response.json();
    return { ...responseData, status: response.status };
  } catch (error) {
    console.error("apiClient error", error);
    throw error;
  }
};
