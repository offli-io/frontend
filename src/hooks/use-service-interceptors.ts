import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IPersonExtended } from "types/activities/activity.dto";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import { getAuthToken, setAuthToken } from "../utils/token.util";
import { useGetApiUrl } from "./use-get-api-url";

interface IUseServiceInterceptorsProps {
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserInfo?: React.Dispatch<
    React.SetStateAction<IPersonExtended | undefined>
  >;
}

export const useServiceInterceptors = ({
  setStateToken,
  setUserInfo,
}: IUseServiceInterceptorsProps) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
