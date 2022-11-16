import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import {
  IEmailPassword,
  IEmailVerificationCode,
} from '../../types/users/user.dto'

export const preCreateUser = async (values: IEmailPassword) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post('/registration/pre-signup', values, {
    // params: searchParams,
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}

export const verifyCodeAndRetrieveUserId = async (values: IEmailVerificationCode) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post('/registration/verify-email', values, {
    // params: searchParams,
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}

export const checkIfEmailAlreadyTaken = async (email?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<boolean>(`/registration/emails/${email}`, {
    // params: searchParams,
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}
