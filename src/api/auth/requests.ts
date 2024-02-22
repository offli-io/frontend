import axios from 'axios';
import { IChangePasswordRequestDto } from 'types/auth/change-password-request.dto';
import { IGoogleRegisterUserValuesDto } from 'types/google/google-register-user-values.dto';
import { ICheckResetPasswordVerificationCodeRequest } from '../../types/auth/check-reset-password-verification-code-request.dto';
import { IConfirmResetPasswordDto } from '../../types/auth/confirm-reset-password.dto';
import { ILoginRequestDto } from '../../types/auth/login-request.dto';
import { ILoginResponseDto } from '../../types/auth/login-response.dto';
import { IVerifyEmailRequestDto } from '../../types/auth/verify-email-request.dto';
import { GoogleAuthCodeFromEnumDto } from '../../types/google/google-auth-code-from-enum.dto';
import { CLIENT_ID } from '../../utils/common-constants';

export const refreshTokenSetup = (res: any) => {
  const refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
  return refreshTiming;
};

export const loginUser = (values: ILoginRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/login`, values, {
    cancelToken: source?.token
  });
  return promise;
};

export const loginViaGoogle = (googleAuthCode?: string, signal?: AbortSignal) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const baseUrlEnvironmentDependent = window.location.href.split('/').slice(0, -1).join('/');

  const promise = axios.post<ILoginResponseDto>(
    `/google/authorization`,
    {
      auth_code: googleAuthCode,
      googleBearerToken: '',
      redirect_uri: `${baseUrlEnvironmentDependent}/login`
    },
    {
      cancelToken: source?.token
    }
  );

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });
  return promise;
};

export const getBearerToken = (
  code: string,
  from: GoogleAuthCodeFromEnumDto,
  signal?: AbortSignal
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const currentUrl =
    // [
    //   GoogleAuthCodeFromEnumDto.LOGIN,
    //   GoogleAuthCodeFromEnumDto.REGISTER,
    // ]?.includes(from);
    // ? window.location.href
    window.location.href.split('/').slice(0, -1).join('/');

  const promise = axios.post(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      client_id: CLIENT_ID,
      client_secret: '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',
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${currentUrl}/`
    },
    {
      cancelToken: source?.token
    }
  );

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};

export const getGoogleAuthCode = (
  from: GoogleAuthCodeFromEnumDto,
  clientID: string,
  state?: any
) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  // for now there is not change in current url only when activity detail ->
  // we need to add state to google request
  const currentUrl = [
    GoogleAuthCodeFromEnumDto.LOGIN,
    GoogleAuthCodeFromEnumDto.REGISTER
  ]?.includes(from)
    ? window.location.href
    : window.location.href.split('/').slice(0, -1).join('/');

  const options = {
    redirect_uri: `${currentUrl}`,
    client_id: clientID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      ...(from === GoogleAuthCodeFromEnumDto.ACTIVITY_DETAIL
        ? ['https://www.googleapis.com/auth/calendar']
        : [])
    ].join(' '),
    ...(state ? { state } : {})
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const registerViaGoogle = async (
  values?: IGoogleRegisterUserValuesDto,
  signal?: AbortSignal
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/google/authorization`, values, {
    cancelToken: source?.token
  });

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};

export const resetPassword = (values: { email?: string }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/registration/reset-password`, values, {
    cancelToken: source?.token
  });
  return promise;
};

export const verifyEmail = (values: IVerifyEmailRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/registration/verify-email`, values, {
    cancelToken: source?.token
  });
  return promise;
};

export const checkVerificationCode = (values: ICheckResetPasswordVerificationCodeRequest) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/registration/check-verification-code`, values, {
    cancelToken: source?.token
  });

  return promise;
};

export const resendCode = (values: { email?: string }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<void>(
    `/registration/resend-code`,
    { ...values, id: '321fdsf' },
    {
      cancelToken: source?.token
    }
  );
  return promise;
};

export const confirmResetPassword = (values: IConfirmResetPasswordDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<void>(`/registration/confirm-reset-password`, values, {
    cancelToken: source?.token
  });
  return promise;
};

export const changePassword = (values: IChangePasswordRequestDto, signal?: AbortSignal) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(`/registration/change-password`, values, {
    cancelToken: source?.token
  });

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });
  return promise;
};
