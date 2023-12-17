import axios from 'axios';
import qs from 'qs';
import { IActivitiesParamsDto } from 'types/activities/activities-params.dto';
import { IUsersParamsDto } from 'types/users';
import { IBuddiesResponseDto } from 'types/users/buddies-response.dto';
import { IUsersResponseDto } from 'types/users/users-response.dto';
import { IUsersSearchParamsDto } from 'types/users/users-search-params.dto';
import { ACTIVITES_LIMIT, BRATISLAVA_CENTER_COORDS_OBJECT } from 'utils/common-constants';
import { ActivityInviteStateEnum } from '../../types/activities/activity-invite-state-enum.dto';
import { IActivityInviteValuesDto } from '../../types/activities/activity-invite-values.dto';
import { IActivityListRestDto } from '../../types/activities/activity-list-rest.dto';
import { ActivitiyParticipantStatusEnum } from '../../types/activities/activity-participant-status-enum.dto';
import {
  IActivity,
  IActivitySearchParams,
  IPerson,
  IPersonExtended
} from '../../types/activities/activity.dto';
import { ICreateActivityParticipantRequestDto } from '../../types/activities/create-activity-participant-request.dto';
import { ICreateActivityRequestDto } from '../../types/activities/create-activity-request.dto';
import { ICreateGoogleEventWithTokenRequestDto } from '../../types/activities/create-google-event-with-token-request.dto';
import { IListActivitiesResponseDto } from '../../types/activities/list-activities-response.dto';
import { IListParticipantsResponseDto } from '../../types/activities/list-participants-response.dto';
import { IMapViewActivitiesResponseDto } from '../../types/activities/mapview-activities.dto';
import {
  IPlaceExternalApiDto,
  IPlaceExternalApiFetchDto
} from '../../types/activities/place-external-api.dto';
import { IPredefinedPictureResponseDto } from '../../types/activities/predefined-picture.dto';
import { IPredefinedTagDto } from '../../types/activities/predefined-tag.dto';
import { IUpdateActivityRequestDto } from './../../types/activities/update-activity-request.dto';

export const getActivities = async ({
  queryFunctionContext,
  searchParams
}: {
  queryFunctionContext: any;
  searchParams?: IActivitySearchParams | undefined;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<any>(`/activities`, {
    params: searchParams,
    cancelToken: source?.token
  });

  queryFunctionContext?.signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};

export const getActivitiesPromiseResolved = async ({
  limit = ACTIVITES_LIMIT,
  offset,
  lon,
  lat,
  sort,
  participantId,
  creatorId,
  participantStatus,
  datetimeFrom,
  datetimeUntil
}: {
  id?: number;
  text?: string;
  tag?: string[];
  date?: Date | null;
  limit?: number;
  offset?: number;
  lon?: number;
  lat?: number;
  sort?: string;
  participantId?: number;
  creatorId?: number;
  participantStatus?: ActivitiyParticipantStatusEnum;
  datetimeFrom?: Date;
  datetimeUntil?: Date;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const response = await axios.get<IActivityListRestDto>(`/activities`, {
    // params: searchParams,
    cancelToken: source?.token,
    params: {
      lat,
      lon,
      limit,
      offset,
      sort,
      participantId,
      creatorId,
      participantStatus,
      datetimeFrom,
      datetimeUntil
    }
  });

  // queryFunctionContext?.signal?.addEventListener("abort", () => {
  //   source.cancel("Query was cancelled by React Query");
  // });

  return response?.data?.activities;
};

export const getActivitiesPromiseResolvedAnonymous = async ({
  limit = ACTIVITES_LIMIT,
  offset,
  sort,
  creatorId,
  datetimeFrom,
  datetimeUntil
}: {
  id?: number;
  text?: string;
  tag?: string[];
  date?: Date | null;
  limit?: number;
  offset?: number;
  lon?: number;
  lat?: number;
  sort?: string;
  creatorId?: number;
  datetimeFrom?: Date;
  datetimeUntil?: Date;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const response = await axios.get<IActivityListRestDto>(`/anonymous/activities`, {
    cancelToken: source?.token,
    params: {
      limit,
      offset,
      sort,
      creatorId,
      datetimeFrom,
      datetimeUntil
    }
  });

  // queryFunctionContext?.signal?.addEventListener("abort", () => {
  //   source.cancel("Query was cancelled by React Query");
  // });

  return response?.data?.activities;
};

export const getActivity = <T>(params: IActivitiesParamsDto) => {
  const promise = axios.get<T>(
    `/activities${params?.id ? `/${params?.id}` : ''}`,
    {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    }
    // {

    //   params: searchParams,
    //   cancelToken: source?.token,
    // }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getActivityAnonymous = <T>(params: IActivitiesParamsDto) => {
  const promise = axios.get<T>(`/anonymous/activities${params?.id ? `/${params?.id}` : ''}`, {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });

  return promise;
};

export const getParticipantActivities = ({
  participantId,
  sort,
  datetimeFrom
}: IActivitiesParamsDto) => {
  const promise = axios.get<IListActivitiesResponseDto>(`/activities`, {
    params: {
      sort,
      participantId,
      participantStatus: ActivitiyParticipantStatusEnum.CONFIRMED,
      datetimeFrom
    }
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const removePersonFromActivity = ({
  personId,
  activityId
}: {
  personId?: number;
  activityId?: number;
}) => {
  const promise = axios.delete<void>(`/activities/${activityId}/participants/${personId}`);

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getLocationFromQuery = (queryString: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPlaceExternalApiDto[]>(
    // `https://nominatim.openstreetmap.org/search?q=${queryString}&format=jsonv2`,
    `https://api.geoapify.com/v1/geocode/search?name=${queryString}&limit=10&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16
    `,
    {
      cancelToken: source?.token,
      headers: {
        origin: 'https://localhost:3000/',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getLocationFromQueryFetch = (
  queryString: string,
  location: { lat?: number; lon?: number } = BRATISLAVA_CENTER_COORDS_OBJECT
): Promise<IPlaceExternalApiFetchDto> => {
  // const promise = axios.get<IPlaceExternalApiDto[]>(
  //   // `https://nominatim.openstreetmap.org/search?q=${queryString}&format=jsonv2`,
  //   `https://api.geoapify.com/v1/geocode/search?name=${queryString}&limit=10&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16
  //   `,
  //   {
  //     cancelToken: source?.token,
  //   }
  // );

  const requestOptions = {
    method: 'GET'
  };

  const promise = fetch(
    `https://api.geoapify.com/v1/geocode/search?name=${queryString}&limit=10&bias=proximity:${location?.lon},${location?.lat}&filter=countrycode:sk,cz&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16`,
    requestOptions
  ).then((response) => response.json());

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getPlaceFromCoordinates = (
  lat: number,
  lon: number
): Promise<IPlaceExternalApiFetchDto> => {
  const requestOptions = {
    method: 'GET'
  };

  const promise = fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&limit=10&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16`,
    requestOptions
  ).then((response) => response.json());

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const createActivity = async (values: IActivity) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ICreateActivityRequestDto>(`/activities`, values, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const updateActivity = async (id: number, values: IActivity) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch<IUpdateActivityRequestDto>(`/activities/${id}`, values, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getUsers = ({ username, ...params }: IUsersSearchParamsDto) => {
  // const CancelToken = axios.CancelToken;
  // const source = CancelToken.source();
  const validUsername = username ?? localStorage.getItem('username');

  // params
  // sentRequestFilter
  // recievedRequestFilter
  // buddyIdToCheckInBuddies = svoje id -> response rozisrena o pole buddy states

  const promise = axios.get<IUsersResponseDto>(`/users`, {
    params: {
      username: username ? validUsername : undefined,
      ...params
    }
    // cancelToken: source?.token,
  });
  // .then((response) => {
  //   const { data } = response;
  //   // If the response is an array with only one element, flatten it
  //   if (Array.isArray(data) && data.length === 1) {
  //     return data[0];
  //   }
  //   // Otherwise, return the original response
  //   return data;
  // });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getUsersPromiseResolved = async ({ username, ...params }: IUsersSearchParamsDto) => {
  const validUsername = username ?? localStorage.getItem('username');

  const promise = await axios.get<IUsersResponseDto>(`/users`, {
    params: {
      username: username ? validUsername : undefined,
      ...params
    }
    // cancelToken: source?.token,
  });

  return promise?.data?.users;
};

export const getUser = ({ id, requestingInfoUserId }: IUsersParamsDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPersonExtended>(`/users${id ? `/${id}` : ''}`, {
    cancelToken: source?.token,
    params: {
      requestingInfoUserId
    }
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getBuddies = (userId: number, queryString?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IBuddiesResponseDto>(`/users/${userId}/buddies`, {
    params: {
      buddyName: queryString
    },
    cancelToken: source?.token
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getRecommendedBuddies = (userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPerson[]>(`/users/${userId}/buddies-recommendation`, {
    cancelToken: source?.token
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getPredefinedTags = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<{ tags: IPredefinedTagDto[] }>(`/predefined/tags`, {
    cancelToken: source?.token
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getMapviewActivities = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IMapViewActivitiesResponseDto>(
    `/mapview/activities?lon=-180&lat=-90&maxLon=180&maxLat=90`,
    {
      cancelToken: source?.token
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const changeActivityParticipantStatus = (
  activityId: number,
  userId: number,
  userInfo: ICreateActivityParticipantRequestDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.put(`/activities/${activityId}/participants/${userId}`, userInfo, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const changeParticipantStatus = (
  activityId: number,
  participantId: number,
  status: ActivityInviteStateEnum
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `/activities/${activityId}/participants/${participantId}`,
    { status },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const inviteBuddyToActivity = (
  activityId: number,
  buddyId: number,
  values: IActivityInviteValuesDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.put(`/activities/${activityId}/participants/${buddyId}`, values, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const uninviteBuddy = (activityId: number, userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete(`/activities/${activityId}/participants/${userId}`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getPredefinedPhotos = (tag?: string[]) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPredefinedPictureResponseDto>(`/predefined/pictures`, {
    cancelToken: source?.token,
    params: {
      tag
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const kickUserFromActivity = (activityId: number, personId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete<void>(`/activities/${activityId}/participants/${personId}`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const acceptActivityInvitation = (activityId?: number, userId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(`/activities/${activityId}/participants/${userId}`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const sendBuddyRequest = (userId?: number, buddy_to_be_id?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `/users/${userId}/buddies`,
    {
      buddy_to_be_id
    },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const uploadFile = (formData?: FormData) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<{ filename?: string }>(`/files`, formData, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getActivityParticipants = ({
  activityId
}: // searchParams,
{
  activityId: number;
  // searchParams?: IActivitySearchParams | undefined;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IListParticipantsResponseDto>(
    `/activities/${activityId}/participants`,
    {
      // params: searchParams,
      cancelToken: source?.token
    }
  );

  // queryFunctionContext?.signal?.addEventListener("abort", () => {
  //   source.cancel("Query was cancelled by React Query");
  // });

  return promise;
};

export const getActivityParticipantsAnonymous = ({
  activityId
}: // searchParams,
{
  activityId: number;
  // searchParams?: IActivitySearchParams | undefined;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IListParticipantsResponseDto>(
    `/anonymous/activities/${activityId}/participants`,
    {
      // params: searchParams,
      cancelToken: source?.token
    }
  );

  // queryFunctionContext?.signal?.addEventListener("abort", () => {
  //   source.cancel("Query was cancelled by React Query");
  // });

  return promise;
};

export const addActivityToCalendar = (
  userId: number,
  values: ICreateGoogleEventWithTokenRequestDto,
  signal?: AbortSignal
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(`/google/events/${userId}`, values, {
    cancelToken: source?.token
  });

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};
