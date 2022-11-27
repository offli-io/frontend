import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import {
  IActivity,
  IActivitySearchParams,
  IPerson,
  IPersonExtended,
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

  const promise = axios.get<IActivity>(`http://localhost:8080/activities`, {
    params: searchParams,
    cancelToken: source?.token,
  })

  queryFunctionContext?.signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query')
  })

  return promise
}

export const getActivity = async (activityId?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<{ activity: IActivity; success: boolean }>(
    `http://localhost:8080/activities/${activityId}`
    // {
    //   params: searchParams,
    //   cancelToken: source?.token,
    // }
  )

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

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

  const promise = axios.post('http://localhost:8080/activities', values, {
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}

export const getUsers = (username?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<IPersonExtended>('http://localhost:8080/users', {
    params: {
      username,
    },
    cancelToken: source?.token,
  })

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise
}

export const getBuddies = (userId: number, queryString?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<IPerson[]>(`/users/${userId}/buddies`, {
    cancelToken: source?.token,
  })

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise
}

export const inviteBuddy = (activityId: number, values: IPerson) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.post(`/activity/${activityId}/invitations`, values, {
    cancelToken: source?.token,
  })

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}

export const uninviteBuddy = (activityId: number, personId: number) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.delete(
    `/activity/${activityId}/invitation/${personId}`,
    {
      cancelToken: source?.token,
    }
  )

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise
}
