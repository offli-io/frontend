import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import { DEFAULT_DEV_URL } from '../../assets/config'
import {
  IEmailPassword,
  IEmailUsernamePassword,
  IEmailVerificationCode,
} from '../../types/users/user.dto'

export const preCreateUser = async (values: IEmailUsernamePassword) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/registration/pre-signup`,
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
    `${DEFAULT_DEV_URL}/registration/verify-email`,
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
    `${DEFAULT_DEV_URL}/registration/emails/${email}`,
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
    `${DEFAULT_DEV_URL}/registration/users/${username}`,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  )
  return promise
}

export const acceptBuddyInvitation = (
  userId?: string,
  buddyToBeId?: string
) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    { buddyToBeId },
    {
      cancelToken: source?.token,
    }
  )

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}
