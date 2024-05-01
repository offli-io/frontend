import { useMutation } from '@tanstack/react-query';
import { facebookAuthorization } from 'api/auth/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { FacebookAuthCodeFromEnumDto } from 'types/facebook/facebook-auth-code-from-enum.dto';
import { IFacebookAuthorizeRequestDto } from 'types/facebook/facebook-authorize-request.dto';
import { FB_CLIENT_ID, FB_STATE_PARAM } from 'utils/common-constants';

interface IUseGoogleAuthorizationProps {
  from: FacebookAuthCodeFromEnumDto;
  state?: any;
  clientID?: string | null;
  registrationFlow?: boolean;
}

export const useFacebookAuthorization = ({
  from,
  clientID = FB_CLIENT_ID,
  registrationFlow
}: IUseGoogleAuthorizationProps) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { setUserInfo, setStateToken } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { mutate: sendAuthorizeViaFacebook, isLoading } = useMutation(
    ['facebook-authorization'],
    (values: IFacebookAuthorizeRequestDto) => {
      abortControllerRef.current = new AbortController();
      return facebookAuthorization({ values, signal: abortControllerRef?.current?.signal, from });
    },
    {
      onSuccess: ({ data }) => {
        setStateToken(data?.token?.access_token ?? null);
        setUserInfo?.({
          id: data?.user_id
        });
        localStorage.setItem('userId', String(data?.user_id));
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error(
          registrationFlow
            ? 'Failed to create account via Facebook'
            : 'Failed to login via Facebook'
        );
      }
    }
  );

  const queryParameters = new URLSearchParams(window.location.search);
  const authorizationCode = queryParameters.get('code');
  const paramsState = queryParameters.get('state');
  const paramsStateParsed = paramsState ? JSON.parse(paramsState) : null;
  const baseUrlEnvironmentDependent = window.location.href.split('/').slice(0, -1).join('/');
  const facebookState = React.useMemo(() => JSON.stringify(FB_STATE_PARAM), []);

  const redirectUrl = React.useMemo(() => `${window.location.origin}${pathname}`, [pathname]);

  React.useEffect(() => {
    if (authorizationCode && !registrationFlow && paramsStateParsed === facebookState) {
      sendAuthorizeViaFacebook({
        auth_code: authorizationCode,
        redirect_uri: redirectUrl
      });
    }
  }, [authorizationCode, redirectUrl]);

  const handleFacebookAuthorization = React.useCallback(() => {
    window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientID}&state=${facebookState}&scope=email&redirect_uri=${redirectUrl}`;
  }, [clientID, redirectUrl]);

  const registerViaFacebook = React.useCallback(
    (values: IFacebookAuthorizeRequestDto) => {
      if (values) sendAuthorizeViaFacebook(values);
    },
    [authorizationCode, baseUrlEnvironmentDependent]
  );

  return {
    facebookAuthCode: authorizationCode,
    handleFacebookAuthorization,
    state: paramsStateParsed,
    isLoading,
    registerViaFacebook
  };
};
