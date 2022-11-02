import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import { IEmailPassword } from '../../types/users/user.dto'

export const loginRetrieveToken = async (values: IEmailPassword) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(`/registration/pre-signup`, values, {
    // params: searchParams,
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}
