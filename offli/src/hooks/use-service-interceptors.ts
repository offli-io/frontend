import { useMutation } from '@tanstack/react-query'
import qs from 'qs'
import React from 'react'
import axios, { AxiosError } from 'axios'
import { getAuthToken, getRefreshToken } from '../utils/token.util'

export const useServiceInterceptors = () => {
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const mut = useMutation(['keycloak-login'], () => {
    abortControllerRef.current = new AbortController()
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    const refreshToken = getRefreshToken()
    const data = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_id: 'UserManagement',
    }
    // const options = {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //   data: qs.stringify(data),
    //   url: 'http://localhost:8082/realms/Offli/protocol/openid-connect/token',
    // }
    const promise = axios.post(
      'http://localhost:8082/realms/Offli/protocol/openid-connect/token',
      qs.stringify(data),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        cancelToken: source.token,
      }
    )

    abortControllerRef.current.signal?.addEventListener('abort', () => {
      source.cancel('Query was cancelled by React Query')
    })

    return promise

    // const params = new URLSearchParams()
    // params.append('username', 'fme')
    // params.append('password', 'test')
    // params.append('grant_type', 'password')
    // params.append('client_id', 'UserManagement')
    // return axios.post(
    //   'http://localhost:8082/realms/Offli/protocol/openid-connect/token',
    //   params,
    //   {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //   }
    // )
  })
  console.log('using service interceptors')

  // if using docker
  const token = getAuthToken()
  axios.defaults.baseURL = token
    ? 'http://localhost:8081'
    : 'http://localhost:8082'
  // 'https://virtserver.swaggerhub.com/semjacko/Activities/1.0.0'
  // 'http://localhost:5000' activities
  // 'http://localhost:8082' usermanagement
  //  'https://virtserver.swaggerhub.com/semjacko/Activities/1.0.0'

  axios.interceptors.request.use(
    config => {
      const _token = getAuthToken()
      if (config) {
        console.log(config)
        config.baseURL = _token
          ? 'http://localhost:8081'
          : 'http://localhost:8082'
        if (config?.headers) {
          //const newConfig = { ...config }
          config.headers['Content-Type'] = 'application/json'
          if (_token) {
            config.headers['Authorization'] = 'Bearer ' + _token
          }
          return config
        }
      }
    },
    error => {
      Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    res => {
      return res
    },
    async (err: AxiosError) => {
      console.log(err)
      const originalConfig = err.config
      if (err?.response?.status === 401) {
        console.error('Token expired')
        // call refresh token
        try {
          mut.mutate()
        } catch (error: any) {
          console.log(error)
        }
      }

      return Promise.reject(err)
    }
  )
}

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
