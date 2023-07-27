import { GoogleAuthCodeFromEnumDto } from "../types/google/google-auth-code-from-enum.dto";
import { CLIENT_ID } from "./common-constants";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setAuthToken = (token?: string) => {
  !!token && localStorage.setItem("token", token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const setRefreshToken = (refreshToken?: string) => {
  !!refreshToken && localStorage.setItem("refresh_token", refreshToken);
};
