import axios from "axios";
import qs from "qs";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { ActivitiyParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import {
  IActivity,
  IActivitySearchParams,
  IPerson,
  IPersonExtended,
} from "../../types/activities/activity.dto";
import { ICreateActivityParticipantRequestDto } from "../../types/activities/create-activity-participant-request.dto";
import { ICreateActivityRequestDto } from "../../types/activities/create-activity-request.dto";
import { IListActivitiesResponseDto } from "../../types/activities/list-activities-response.dto";
import {
  IPlaceExternalApiDto,
  IPlaceExternalApiFetchDto,
} from "../../types/activities/place-external-api.dto";
import {
  IPredefinedPictureDto,
  IPredefinedPictureResponseDto,
} from "../../types/activities/predefined-picture.dto";
import { IPredefinedTagDto } from "../../types/activities/predefined-tag.dto";
import { IUpdateActivityRequestDto } from "./../../types/activities/update-activity-request.dto";
import { IListParticipantsResponseDto } from "../../types/activities/list-participants-response.dto";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { ICreateGoogleEventWithTokenRequestDto } from "../../types/activities/create-google-event-with-token-request.dto";
import { IActivityInviteValuesDto } from "../../types/activities/activity-invite-values.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import { IActivitiesParamsDto } from "types/activities/activities-params.dto";
import { IUsersParamsDto } from "types/users";
import { IMapViewActivitiesResponseDto } from "../../types/activities/mapview-activities.dto";
import { IBuddiesResponseDto } from "types/users/buddies-response.dto";
import { IUsersResponseDto } from "types/users/users-response.dto";
import { IUsersSearchParamsDto } from "types/users/users-search-params.dto";

export const getActivities = async ({
  queryFunctionContext,
  searchParams,
}: {
  queryFunctionContext: any;
  searchParams?: IActivitySearchParams | undefined;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<any>(`${DEFAULT_DEV_URL}/activities`, {
    params: searchParams,
    cancelToken: source?.token,
  });

  queryFunctionContext?.signal?.addEventListener("abort", () => {
    source.cancel("Query was cancelled by React Query");
  });

  return promise;
};

export const getActivitiesPromiseResolved = async ({
  limit,
  offset,
  lon,
  lat,
  sort,
  participantId,
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
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const response = await axios.get<IActivityListRestDto>(
    `${DEFAULT_DEV_URL}/activities`,
    {
      // params: searchParams,
      cancelToken: source?.token,
      params: {
        lat,
        lon,
        limit: 10,
        offset,
        sort,
        participantId,
      },
    }
  );

  // queryFunctionContext?.signal?.addEventListener("abort", () => {
  //   source.cancel("Query was cancelled by React Query");
  // });

  return response?.data?.activities;
};

export const getActivity = <T>({
  id,
  text,
  tag,
  datetimeFrom,
  limit,
  offset,
  lon,
  lat,
  sort,
  participantId,
}: IActivitiesParamsDto) => {
  const promise = axios.get<T>(
    `${DEFAULT_DEV_URL}/activities${id ? `/${id}` : ""}`,
    {
      params: {
        text,
        tag,
        datetimeFrom,
        limit,
        offset,
        lon,
        lat,
        participantId,
        sort,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
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

export const getParticipantActivities = ({
  participantId,
}: {
  participantId?: number;
}) => {
  const promise = axios.get<IListActivitiesResponseDto>(
    `${DEFAULT_DEV_URL}/activities`,
    {
      params: {
        participantId,
        participantStatus: ActivitiyParticipantStatusEnum.CONFIRMED,
      },
      // params: {
      //   text,
      //   tag,
      // },
      // paramsSerializer: (params) => {
      //   return qs.stringify(params, { arrayFormat: "repeat" });
      // },
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

export const removePersonFromActivity = ({
  personId,
  activityId,
}: {
  personId?: number;
  activityId?: number;
}) => {
  const promise = axios.delete<void>(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants/${personId}`
  );

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
        origin: "https://localhost:3000/",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getLocationFromQueryFetch = (
  queryString: string
): Promise<IPlaceExternalApiFetchDto> => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  // const promise = axios.get<IPlaceExternalApiDto[]>(
  //   // `https://nominatim.openstreetmap.org/search?q=${queryString}&format=jsonv2`,
  //   `https://api.geoapify.com/v1/geocode/search?name=${queryString}&limit=10&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16
  //   `,
  //   {
  //     cancelToken: source?.token,
  //   }
  // );

  var requestOptions = {
    method: "GET",
  };

  const promise = fetch(
    `https://api.geoapify.com/v1/geocode/search?name=${queryString}&limit=10&format=json&apiKey=86a10638b4cf4c339ade6ab08f753b16`,
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
  var requestOptions = {
    method: "GET",
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

  const promise = axios.post<ICreateActivityRequestDto>(
    `${DEFAULT_DEV_URL}/activities`,
    values,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const updateActivity = async (
  id: number,
  values: IUpdateActivityRequestDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch<IUpdateActivityRequestDto>(
    `${DEFAULT_DEV_URL}/activities/${id}`,
    values,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getUsers = ({ username, ...params }: IUsersSearchParamsDto) => {
  // const CancelToken = axios.CancelToken;
  // const source = CancelToken.source();
  const validUsername = username ?? localStorage.getItem("username");

  // params
  // sentRequestFilter
  // recievedRequestFilter
  // buddyIdToCheckInBuddies = svoje id -> response rozisrena o pole buddy states

  const promise = axios.get<IUsersResponseDto>(`${DEFAULT_DEV_URL}/users`, {
    params: {
      username: username ? validUsername : undefined,
      ...params,
    },
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

export const getUsersPromiseResolved = async ({
  username,
  ...params
}: IUsersSearchParamsDto) => {
  const validUsername = username ?? localStorage.getItem("username");

  const promise = await axios.get<IUsersResponseDto>(
    `${DEFAULT_DEV_URL}/users`,
    {
      params: {
        username: username ? validUsername : undefined,
        ...params,
      },
      // cancelToken: source?.token,
    }
  );

  return promise?.data?.users;
};

export const getUser = ({ id, requestingInfoUserId }: IUsersParamsDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPersonExtended>(
    `${DEFAULT_DEV_URL}/users${id ? `/${id}` : ""}`,
    {
      cancelToken: source?.token,
      params: {
        requestingInfoUserId,
      },
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getBuddies = (userId: number, queryString?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IBuddiesResponseDto>(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    {
      params: {
        buddyName: queryString,
      },
      cancelToken: source?.token,
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getRecommendedBuddies = (userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPerson[]>(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies-recommendation`,
    {
      cancelToken: source?.token,
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getPredefinedTags = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<{ tags: IPredefinedTagDto[] }>(
    `${DEFAULT_DEV_URL}/predefined/tags`,
    {
      cancelToken: source?.token,
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getMapviewActivities = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IMapViewActivitiesResponseDto>(
    `${DEFAULT_DEV_URL}/mapview/activities?lon=-180&lat=-90&maxLon=180&maxLat=90`,
    {
      cancelToken: source?.token,
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

  const promise = axios.put(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants/${userId}`,
    userInfo,
    {
      cancelToken: source?.token,
    }
  );

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
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants/${participantId}`,
    { status },
    {
      cancelToken: source?.token,
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

  const promise = axios.put(
    `/activities/${activityId}/participants/${buddyId}`,
    values,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const uninviteBuddy = (activityId: number, userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete(
    `/activities/${activityId}/participants/${userId}`,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getPredefinedPhotos = (tag?: string[]) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPredefinedPictureResponseDto>(
    `${DEFAULT_DEV_URL}/predefined/pictures`,
    {
      cancelToken: source?.token,
      params: {
        tag,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const kickUserFromActivity = (activityId: number, personId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete<void>(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants/${personId}`,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const acceptActivityInvitation = (
  activityId?: number,
  userId?: number
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants/${userId}`,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const sendBuddyRequest = (userId?: number, buddy_to_be_id?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    {
      buddy_to_be_id,
    },
    {
      cancelToken: source?.token,
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

  const promise = axios.post<{ filename?: string }>(
    `${DEFAULT_DEV_URL}/files`,
    formData,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getActivityParticipants = ({
  activityId,
}: // searchParams,
{
  activityId: number;
  // searchParams?: IActivitySearchParams | undefined;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IListParticipantsResponseDto>(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants`,
    {
      // params: searchParams,
      cancelToken: source?.token,
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

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/google/events/${userId}`,
    values,
    {
      cancelToken: source?.token,
    }
  );

  signal?.addEventListener("abort", () => {
    source.cancel("Query was cancelled by React Query");
  });

  return promise;
};
