import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import {
  IEmailPassword,
  IEmailUsernamePassword,
  IEmailVerificationCode,
} from '../../types/users/user.dto'

export const preCreateUser = async (values: IEmailUsernamePassword) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(
    'http://localhost:8080/registration/pre-signup',
    values,
    {
      cancelToken: source?.token,
    }
  )
  return promise
}

export const verifyCodeAndRetrieveUserId = async (
  values: IEmailVerificationCode
) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post<{ userId?: string }>(
    'http://localhost:8080/registration/verify-email',
    values,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  )
  return promise
}

export const checkIfEmailAlreadyTaken = async (email?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<boolean>(
    `http://localhost:8080/registration/emails/${email}`,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  )
  return promise
}

export const checkIfUsernameAlreadyTaken = async (username?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<boolean>(
    `http://localhost:8080/registration/users/${username}`,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  )
  return promise
}
