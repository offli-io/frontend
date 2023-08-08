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
import { IUpdateActivityRequestDto } from "./../../types/activities/update-activity-request.dto";
import { IListParticipantsResponseDto } from "../../types/activities/list-participants-response.dto";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { ICreateGoogleEventWithTokenRequestDto } from "../../types/activities/create-google-event-with-token-request.dto";
import { IActivityInviteValuesDto } from "../../types/activities/activity-invite-values.dto";

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

export const getActivity = <T>({
  id,
  text,
  tag,
  date,
}: {
  id?: number;
  text?: string;
  tag?: string[];
  date?: Date | null;
}) => {
  const promise = axios.get<T>(
    `${DEFAULT_DEV_URL}/activities${id ? `/${id}` : ""}`,
    {
      params: {
        text,
        tag,
        date,
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

export const getUsers = ({ username }: { username?: string }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const validUsername = username ?? localStorage.getItem("username");

  const promise = axios.get<IPersonExtended[]>(`${DEFAULT_DEV_URL}/users`, {
    params: {
      username: username ? validUsername : undefined,
    },
    cancelToken: source?.token,
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

export const getUser = ({ id }: { id?: number }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IPersonExtended>(
    `${DEFAULT_DEV_URL}/users${id ? `/${id}` : ""}`,
    {
      cancelToken: source?.token,
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

  const promise = axios.get<IPerson[]>(
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

  const promise = axios.get<{ tags: string[] }>(
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
  values: IActivityInviteValuesDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(`/activities/${activityId}/participants`, values, {
    cancelToken: source?.token,
  });

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
