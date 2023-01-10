import axios from "axios";
import qs from "qs";
import { QueryFunctionContext } from "react-query";
import { DEFAULT_DEV_URL } from "../../assets/config";
import {
  IActivity,
  IActivitySearchParams,
  IPerson,
  IPersonExtended,
} from "../../types/activities/activity.dto";
import { ICreateActivityRequestDto } from "../../types/activities/create-activity-request.dto";
import { IPlaceExternalApiDto } from "../../types/activities/place-external-api.dto";
import { IPredefinedPictureDto } from "../../types/activities/predefined-picture.dto";
import { IPredefinedTagDto } from "../../types/activities/predefined-tag.dto";

export const getActivities = async ({
  queryFunctionContext,
  searchParams,
}: {
  queryFunctionContext: QueryFunctionContext<any>;
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

export const getActivity = <T>({ id }: { id?: string }) => {
  const promise = axios.get<T>(
    `${DEFAULT_DEV_URL}/activities${id ? `/${id}` : ""}`
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
  personId?: string;
  activityId?: string;
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
    `https://nominatim.openstreetmap.org/search?q=${queryString}&format=jsonv2`,
    {
      cancelToken: source?.token,
    }
  );

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

export const getUsers = ({
  username,
  id,
}: {
  username?: string;
  id?: string;
}) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const validUsername = username ?? localStorage.getItem("username");

  const promise = axios.get<IPersonExtended>(
    `${DEFAULT_DEV_URL}/users${id ? `/${id}` : ""}`,
    {
      params: {
        username: username ? validUsername : undefined,
      },
      cancelToken: source?.token,
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const getBuddies = (userId: string, queryString?: string) => {
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

export const inviteBuddy = (activityId: string, values: any) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/activities/${activityId}/invitations`,
    { ...values, profile_photo: values?.profile_photo_url },
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const uninviteBuddy = (activityId: number, personId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete(
    `/activity/${activityId}/invitation/${personId}`,
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
        return qs.stringify(params);
      },
    }
  );

  // queryFunctionContext?.signal?.addEventListener('abort', () => {
  //   source.cancel('Query was cancelled by React Query')
  // })

  return promise;
};

export const kickUserFromActivity = (activityId: string, personId: string) => {
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
