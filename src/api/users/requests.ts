import axios from 'axios';
import { IFetchInstagramPhotosResponseDto } from 'types/instagram/fetch-instagram-photos-response.dto';
import { BuddyStateEnum } from 'types/users';
import { BuddyRequestActionEnum } from '../../types/users/buddy-request-action-enum.dto';
import { IBuddyStateResponseDto } from '../../types/users/buddy-state-response.dto';
import { IUpdateUserRequestDto } from '../../types/users/update-user-request.dto';
import { IEmailUsernamePassword, IEmailVerificationCode } from '../../types/users/user.dto';

export const preCreateUser = async (values: IEmailUsernamePassword) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(`/registration/pre-signup`, values, {
    cancelToken: source?.token
  });
  return promise;
};

export const verifyCodeAndRetrieveUserId = async (values: IEmailVerificationCode) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<{ userId?: number }>(`/registration/verify-email`, values, {
    // params: searchParams,
    cancelToken: source?.token
  });
  return promise;
};

export const checkIfEmailAlreadyTaken = async (email?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<boolean>(`/registration/emails/${email}`, {
    // params: searchParams,
    cancelToken: source?.token
  });
  return promise;
};

export const checkIfUsernameAlreadyTaken = async (username?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<boolean>(`/registration/users/${username}`, {
    // params: searchParams,
    cancelToken: source?.token
  });
  return promise;
};

export const getBuddyState = (id: number, buddyId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IBuddyStateResponseDto>(`/users/${id}/buddies/${buddyId}`, {
    // params: searchParams,
    cancelToken: source?.token
  });
  return promise;
};

export const acceptBuddyInvitation = (userId?: number, buddyToBeId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  //change to PATCH
  const promise = axios.post(
    `/users/${userId}/buddies`,
    { buddy_to_be_id: buddyToBeId },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const updateProfileInfo = (userId?: number, values?: IUpdateUserRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(`/users/${userId}`, values, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const rejectBuddyInvitation = (userId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `/users/${userId}/buddies`,
    //define DTO on FE
    { status: BuddyStateEnum.BLOCKED },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const toggleBuddyInvitation = (
  userId?: number,
  buddyToBeId?: number,
  state?: BuddyRequestActionEnum
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `/users/${userId}/buddies/${buddyToBeId}`,
    { state },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const deleteBuddy = (userId?: number, idToDelete?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete(`/users/${userId}/buddies/${idToDelete}`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const addBuddy = (userId?: number, buddyId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `/users/${userId}/buddies/${buddyId}`,
    { status: 'Pending' },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const connectInstagram = (userId?: number, photoUrls?: string[]) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `/instagram/${userId}/media`,
    { instagramMediaUrls: photoUrls },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const fetchInstagramPhotos = (userId?: number, authCode?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<IFetchInstagramPhotosResponseDto>(
    `/instagram/${userId}/fetch`,
    { authCode },
    {
      cancelToken: source?.token
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const unlinkInstagram = (userId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete(`/instagram/${userId}/media`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};
