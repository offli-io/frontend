import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { getBearerToken, getGoogleAuthCode } from '../../api/auth/requests';
import { GoogleAuthCodeFromEnumDto } from '../../types/google/google-auth-code-from-enum.dto';

interface IUseGoogleAuthorizationProps {
  from: GoogleAuthCodeFromEnumDto;
  state?: any;
  clientID?: string | null;
  omitTokenGetting?: boolean;
}

export const useGoogleAuthorization = ({
  from,
  state,
  clientID,
  omitTokenGetting = false
}: IUseGoogleAuthorizationProps) => {
  const [googleToken, setGoogleToken] = React.useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const { mutate: sendGetBearerToken, isLoading } = useMutation(
    ['bearer-token'],
    (authorizationCode: string) => {
      abortControllerRef.current = new AbortController();
      return getBearerToken(authorizationCode, from, abortControllerRef?.current?.signal);
    },
    {
      onSuccess: (data) => {
        data?.data?.access_token && setGoogleToken(data?.data?.access_token);
      },
      onError: () => {
        toast.error('Failed to get Google Bearer token');
      }
    }
  );

  const queryParameters = new URLSearchParams(window.location.search);
  const authorizationCode = queryParameters.get('code');
  const paramsState = queryParameters.get('state');
  const paramsStateParsed = paramsState ? JSON.parse(paramsState) : null;

  const handleGoogleAuthorization = React.useCallback(() => {
    if (!clientID) {
      return;
    }
    window.location.href = getGoogleAuthCode(from, clientID, state);
  }, [clientID, from, state]);

  React.useEffect(() => {
    if (authorizationCode && !omitTokenGetting) {
      sendGetBearerToken(authorizationCode);
    }
  }, [authorizationCode]);

  return {
    authorizationCode,
    googleToken,
    handleGoogleAuthorization,
    state: paramsStateParsed,
    isLoading
  };
};
