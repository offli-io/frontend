import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import {
  IActivity,
  IActivitySearchParams,
} from '../../types/activities/activity.dto'

export const getActivities = async ({
  queryFunctionContext,
  searchParams,
}: {
  queryFunctionContext: QueryFunctionContext<any>
  searchParams?: IActivitySearchParams | undefined
}) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<IActivity>(`/activity`, {
    params: searchParams,
    cancelToken: source?.token,
  })

  queryFunctionContext?.signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query')
  })

  return promise
}
