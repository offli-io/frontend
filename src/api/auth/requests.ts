import { DEFAULT_DEV_URL } from "../../assets/config";
import { ILoginRequestDto } from "../../types/auth/login-request.dto";
import { ILoginResponseDto } from "../../types/auth/login-response.dto";
import axios from "axios";
import { IVerifyEmailRequestDto } from "../../types/auth/verify-email-request.dto";
import { IConfirmResetPasswordDto } from "../../types/auth/confirm-reset-password.dto";
import { ICheckResetPasswordVerificationCodeRequest } from "../../types/auth/check-reset-password-verification-code-request.dto";
import { IGoogleLoginRequestDto } from "../../types/auth/google-login-request.dto";
import { CLIENT_ID } from "../../utils/common-constants";

export const refreshTokenSetup = (res: any) => {
  const refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
  return refreshTiming;
};

export const loginUser = (values: ILoginRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/login`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const loginViaGoogle = (accessToken?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/google/login`,
    { googleBearerToken: accessToken },
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const getBearerToken = (code?: string, type?: "login" | "register") => {
  const currentUrl = window.location.href.split("/").slice(0, -1).join("/");

  const promise = axios.post("https://www.googleapis.com/oauth2/v4/token", {
    client_id: CLIENT_ID,
    client_secret: "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",
    code,
    grant_type: "authorization_code",
    redirect_uri: `${currentUrl}/`,
  });

  return promise;
};

export const registerViaGoogle = async (accessToken?: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/google/registration`,
    { googleBearerToken: accessToken },
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const resetPassword = (values: { email?: string }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/registration/reset-password`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const verifyEmail = (values: IVerifyEmailRequestDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/registration/verify-email`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const checkVerificationCode = (
  values: ICheckResetPasswordVerificationCodeRequest
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<ILoginResponseDto>(
    `${DEFAULT_DEV_URL}/registration/check-verification-code`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const resendCode = (values: { email?: string }) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<void>(
    `${DEFAULT_DEV_URL}/registration/resend-code`,
    { ...values, id: "321fdsf" },
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

export const confirmResetPassword = (values: IConfirmResetPasswordDto) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.post<void>(
    `${DEFAULT_DEV_URL}/registration/confirm-reset-password`,
    values,
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};

//   const refreshToken = async () => {
//     const newAuthRes = await res.reloadAuthResponse()
//     refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
//     console.log('new auth token', newAuthRes.id_token)
//     setTimeout(refreshToken, refreshTiming)
//   }
//   setTimeout(refreshToken, refreshTiming)
// }
