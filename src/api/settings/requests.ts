import axios from 'axios';
import { IUserSettingsRequestDto } from 'types/settings/user-settings-request.dto';

export const changeUserSettings = (userId?: number, values?: IUserSettingsRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.put(`/users/${userId}/settings`, values, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};

export const getUserSettings = (userId?: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<IUserSettingsRequestDto>(`/users/${userId}/settings`, {
    cancelToken: source?.token
  });

  //   queryFunctionContext?.signal?.addEventListener('abort', () => {
  //     source.cancel('Query was cancelled by React Query')
  //   })

  return promise;
};
