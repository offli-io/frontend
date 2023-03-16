import { IUpdateActivityRequestDto } from "./../../types/activities/update-activity-request.dto";
import axios from "axios";
import qs from "qs";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { ActivitiyParticipantStateEnum } from "../../types/activities/activity-participant-state-enum.dto";
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
import { IPredefinedPictureDto } from "../../types/activities/predefined-picture.dto";
import { IPredefinedTagDto } from "../../types/activities/predefined-tag.dto";

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
}: {
  id?: number;
  text?: string;
  tag?: string[];
}) => {
  const promise = axios.get<T>(
    `${DEFAULT_DEV_URL}/activities${id ? `/${id}` : ""}`,
    {
      params: {
        text,
        tag,
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
        participantStatus: ActivitiyParticipantStateEnum.CONFIRMED,
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

export const inviteBuddy = (
  activityId: number,
  userInfo: ICreateActivityParticipantRequestDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/activities/${activityId}/participants`,
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

  const promise = axios.get<{ pictures: IPredefinedPictureDto[] }>(
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

export const uploadActivityPhoto = (formData?: FormData) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<{ url?: string }>(
    `${DEFAULT_DEV_URL}/files`,
    formData,
    {
      cancelToken: source?.token,
    }
  );

  return promise;
};
