import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IPersonExtended } from "types/activities/activity.dto";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import { getAuthToken, setAuthToken } from "../utils/token.util";
import { useGetApiUrl } from "./use-get-api-url";
import { AuthenticationContext } from "assets/theme/authentication-provider";

interface IUseServiceInterceptorsProps {
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserInfo?: React.Dispatch<
    React.SetStateAction<IPersonExtended | undefined>
  >;
  userId?: number;
}

export const useServiceInterceptors = ({
  setStateToken,
  setUserInfo,
  userId,
}: IUseServiceInterceptorsProps) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();

  axios.interceptors.request.use(
    (config) => {
      const _token = getAuthToken();
      if (config) {
        if (process.env.NODE_ENV !== "development") {
          config.baseURL = baseUrl;
        }
        if (config?.headers) {
          //const newConfig = { ...config }
          //config.headers['Content-Type'] = 'application/json'
          const explicitToken = config.headers["Authorization"];
          if (_token && !explicitToken) {
            config.headers["Authorization"] = "Bearer " + _token;
          }
          if (userId) {
            config.headers["USER_ID"] = userId;
          }
          return config;
        }
      }
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error: AxiosError) => {
      // if token has expired
      if (error?.response?.status === 401) {
        setStateToken(null);
        setAuthToken(undefined);
        setUserInfo?.({ username: undefined, id: undefined });
        queryClient.invalidateQueries();
        queryClient.removeQueries();
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        // navigate(ApplicationLocations.LOGIN);
      }
      //TODO uncomment
      // const originalConfig = err.config;
      // if (err?.response?.status === 401) {
      //   console.error('Token expired')
      //   // call refresh token
      //   try {
      //     mut.mutate()
      //   } catch (error: any) {
      //     console.log(error)
      //   }
      // }

      return Promise.reject(error);
    }
  );
};
