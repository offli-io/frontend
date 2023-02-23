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

export const getGoogleUrl = (from?: "login" | "register") => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: `https://localhost:3000/${from}/`,
    client_id: CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    // state: from,
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};
