import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useGetApiUrl } from 'hooks/utils/use-get-api-url';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OffliUserAgent } from 'types/common/offli-user-agent-enum.dto';
import { getPlatfromFromStorage } from 'utils/storage.util';
import { refreshToken } from '../../api/auth/requests';
import { AuthenticationContext } from '../../components/context/providers/authentication-provider';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { getAuthToken, getRefreshTokenFromStorage, setAuthToken } from '../../utils/token.util';

let isRefreshing = false;
let failedQueue: ((error: AxiosError | null, token?: string | null) => void)[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom(error);
    } else {
      prom(null, token);
    }
  });

  failedQueue = [];
};

export const useServiceInterceptors = () => {
  const { setUserInfo, setStateToken, setRefreshToken, userInfo } =
    React.useContext(AuthenticationContext);
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refreshAuthLogic = async (failedRequest: AxiosRequestConfig) => {
    const refreshToken = getRefreshTokenFromStorage();
    if (refreshToken) {
      try {
        const { data } = await sendRefreshToken(refreshToken);
        setAuthToken(data?.token?.access_token);

        if (failedRequest?.headers)
          failedRequest.headers['Authorization'] = 'Bearer ' + data?.token?.access_token;
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('No refresh token available'));
    }
  };

  const { mutateAsync: sendRefreshToken } = useMutation(
    ['refresh-token'],
    (token: string) => {
      return refreshToken(token);
    },
    {
      onSuccess: ({ data }) => {
        setStateToken?.(data?.token?.access_token ?? null);
        setRefreshToken?.(data?.token?.refresh_token ?? null);
        // localStorage.setItem('userId', String(data?.user_id));
        // navigate(ApplicationLocations.EXPLORE);
      },
      onError: (error) => {
        processQueue(error as AxiosError, null);
        setStateToken?.(null);
        setAuthToken(undefined);
        setUserInfo?.({ username: undefined, id: undefined });
        queryClient.invalidateQueries();
        queryClient.removeQueries();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        toast.error('Failed to log in');
        navigate(ApplicationLocations.LOGIN);
      }
    }
  );

  axios.interceptors.request.use(
    async (config) => {
      const _token = getAuthToken();
      const platform = getPlatfromFromStorage() ?? OffliUserAgent.Web;
      if (process.env.NODE_ENV !== 'development') {
        config.baseURL = baseUrl;
      }

      if (_token) {
        const decodedToken: JwtPayload = jwtDecode(_token);
        const tokenExpiration = (decodedToken?.exp ?? 0) * 1000;
        const timeInMsNow = Date.now();
        //if token is expired
        if (timeInMsNow >= tokenExpiration && !isRefreshing) {
          isRefreshing = true;
          try {
            await refreshAuthLogic(config);
            isRefreshing = false;
          } catch (error) {
            isRefreshing = false;
            return Promise.reject(error);
          }
        }
      }
      if (config?.headers) {
        const explicitToken = config.headers['Authorization'];
        if (_token && !explicitToken) {
          config.headers['Authorization'] = 'Bearer ' + _token;
        }
        if (userInfo?.id) {
          config.headers['user-id'] = userInfo.id;
        }
        if (platform) {
          config.headers['Offli-User-Agent'] = platform;
        }
      }
      return config;
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
      const originalRequest: any = error.config;
      if (error?.response?.status === 401) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push((err, token) => {
              if (err) {
                reject(err);
              } else {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                resolve(axios(originalRequest));
              }
            });
          });
        }

        isRefreshing = true;
        return new Promise((resolve, reject) => {
          refreshAuthLogic(originalRequest)
            .then(() => {
              isRefreshing = false;
              resolve(axios(originalRequest));
            })
            .catch((err) => {
              isRefreshing = false;
              reject(err);
            });
        });
      }

      return Promise.reject(error);
    }
    //   // if token has expired
    //   if (error?.response?.status === 401) {
    //     //TODO exchange refresh token
    //     setStateToken?.(null);
    //     setAuthToken(undefined);
    //     setUserInfo?.({ username: undefined, id: undefined });
    //     queryClient.invalidateQueries();
    //     queryClient.removeQueries();
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('userId');
    //     // toast.error('Your token has expired - you will be redirected to login page');
    //     navigate(ApplicationLocations.LOGIN);
    //   }

    //   return Promise.reject(error);
    // }
  );
};
