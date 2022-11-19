import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import {
  IActivity,
  IActivitySearchParams,
} from '../../types/activities/activity.dto'
import { IPlaceExternalApiDto } from '../../types/activities/place-external-api.dto'

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

export const getLocationFromQuery = (queryString: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<IPlaceExternalApiDto[]>(
    `https://nominatim.openstreetmap.org/search?q=${queryString}&format=jsonv2`,
    {
      cancelToken: source?.token,
    }
  )

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise
}

export const createActivity = async (values: IActivity) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post('/activity', values, {
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}
