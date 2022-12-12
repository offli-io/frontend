import axios from 'axios'
import { QueryFunctionContext } from 'react-query'
import { DEFAULT_DEV_URL } from '../../assets/config'
import {
  IActivity,
  IActivitySearchParams,
  IPerson,
  IPersonExtended,
} from '../../types/activities/activity.dto'
import { IPlaceExternalApiDto } from '../../types/activities/place-external-api.dto'
import qs from 'qs'
import { IPredefinedPictureDto } from '../../types/activities/predefined-picture.dto'

export const getActivities = async ({
  queryFunctionContext,
  searchParams,
}: {
  queryFunctionContext: QueryFunctionContext<any>
  searchParams?: IActivitySearchParams | undefined
}) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<any>(`${DEFAULT_DEV_URL}/activities`, {
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
    `${DEFAULT_DEV_URL}/activities/${activityId}`
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

  const promise = axios.post(`${DEFAULT_DEV_URL}/activities`, values, {
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
  const validUsername = username ?? localStorage.getItem('username')

  const promise = axios.get<IPersonExtended>(`${DEFAULT_DEV_URL}/users`, {
    params: {
      username: validUsername,
    },
    cancelToken: source?.token,
  })

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise
}

export const getBuddies = (userId: string, queryString?: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<IPerson[]>(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    {
      cancelToken: source?.token,
    }
  )

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

export const getPredefinedPhotos = (tag?: string[]) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<{ pictures: IPredefinedPictureDto[] }>(
    `${DEFAULT_DEV_URL}/predefined/pictures`,
    {
      cancelToken: source?.token,
      params: {
        tag,
      },
      paramsSerializer: params => {
        return qs.stringify(params)
      },
    }
  )

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise
}
