import axios from "axios";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { IUpdateUserRequestDto } from "../../types/users/update-user-request.dto";
import {
  IEmailUsernamePassword,
  IEmailVerificationCode,
} from "../../types/users/user.dto";

export const preCreateUser = async (values: IEmailUsernamePassword) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post(
    `${DEFAULT_DEV_URL}/registration/pre-signup`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const verifyCodeAndRetrieveUserId = async (
  values: IEmailVerificationCode
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<{ userId?: number }>(
    `${DEFAULT_DEV_URL}/registration/verify-email`,
    values,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const checkIfEmailAlreadyTaken = async (email?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<boolean>(
    `${DEFAULT_DEV_URL}/registration/emails/${email}`,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const checkIfUsernameAlreadyTaken = async (username?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<boolean>(
    `${DEFAULT_DEV_URL}/registration/users/${username}`,
    {
      // params: searchParams,
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const acceptBuddyInvitation = (
  userId?: number,
  buddyToBeId?: number
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  //change to PATCH
  const promise = axios.post(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    { buddy_to_be_id: buddyToBeId },
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const updateProfileInfo = (
  userId?: number,
  values?: IUpdateUserRequestDto
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(`${DEFAULT_DEV_URL}/users/${userId}`, values, {
    cancelToken: source?.token,
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const rejectBuddyInvitation = (
  userId?: number,
  buddyToBeId?: number
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies`,
    //define DTO on FE
    { status: "Rejected" },
    {
      cancelToken: source?.token,
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

  const promise = axios.delete(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies/${idToDelete}`,
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const addBuddy = (userId?: number, buddyId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch(
    `${DEFAULT_DEV_URL}/users/${userId}/buddies/${buddyId}`,
    { status: "Pending" },
    {
      cancelToken: source?.token,
    }
  );

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};
