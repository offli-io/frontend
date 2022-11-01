import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import { IEmailPassword } from '../../types/users/user.dto'


export const loginRetrieveToken = async ({
//   queryFunctionContext,
  postValues
}: {
//   queryFunctionContext: QueryFunctionContext<any>
  postValues?: IEmailPassword | undefined
}) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(`/login`, {
    // params: searchParams,
    postValues,
    cancelToken: source?.token,
  })

//   queryFunctionContext?.signal?.addEventListener('abort', () => {
//     source.cancel('Query was cancelled by React Query')
//   })

  return promise
}
