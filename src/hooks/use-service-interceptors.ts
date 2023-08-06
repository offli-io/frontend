import { useMutation } from "@tanstack/react-query";
import qs from "qs";
import React from "react";
import axios, { AxiosError } from "axios";
import { getAuthToken, getRefreshToken } from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import { useGetApiUrl } from "./use-get-api-url";

export const useServiceInterceptors = () => {
  const { stateToken } = React.useContext(AuthenticationContext);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const baseUrl = useGetApiUrl();

  // if using docker
  const token = getAuthToken();
  // axios.defaults.baseURL = token
  //   ? 'http://localhost:8081'
  //   : 'http://localhost:8082'
  // 'https://virtserver.swaggerhub.com/semjacko/Activities/1.0.0'
  // 'http://localhost:5000' activities
  // 'http://localhost:8082' usermanagement
  //  'https://virtserver.swaggerhub.com/semjacko/Activities/1.0.0'

  axios.interceptors.request.use(
    (config) => {
      const _token = getAuthToken();
      if (config) {
        // if you have token -> all requests same port
        // if you dont have token 2 subcases
        // keycloak - e.g. :8082
        // Offli unauthorized backend - e.g. :5000
        config.baseURL = baseUrl;
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
    async (err: AxiosError) => {
      //TODO uncomment
      const originalConfig = err.config;
      // if (err?.response?.status === 401) {
      //   console.error('Token expired')
      //   // call refresh token
      //   try {
      //     mut.mutate()
      //   } catch (error: any) {
      //     console.log(error)
      //   }
      // }

      return Promise.reject(err);
    }
  );
};

// import axios from 'axios'

// // Add a request interceptor
// axios.interceptors.request.use(
//   config => {
//     //const token = localStorageService.getAccessToken()
//     // if (token) {
//     //   config.headers['Authorization'] = 'Bearer ' + token
//     // }

//     config?.headers?.['Content-Type'] = 'application/json'
//     return config
//   },
//   error => {
//     Promise.reject(error)
//   }
// )
