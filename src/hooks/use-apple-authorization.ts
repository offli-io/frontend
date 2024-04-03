import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appleAuthorization } from 'api/auth/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppleAuthCodeFromEnum } from 'types/apple/apple-auth-code-from-enum.dto';
import { IAppleAuthorizeRequestDto } from 'types/apple/apple-authorize-request-dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { PickUsernameTypeEnum } from 'types/common/pick-username-type-enum.dto';
import { FB_CLIENT_ID } from 'utils/common-constants';

interface IUseAppleAuthorizationProps {
  from: AppleAuthCodeFromEnum;
  state?: any;
  clientID?: string | null;
  registrationFlow?: boolean;
}

export const useAppleAuthorization = ({
  from,
  clientID = FB_CLIENT_ID,
  registrationFlow
}: IUseAppleAuthorizationProps) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { setUserInfo, setStateToken } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: sendAuthorizeViaApple, isLoading } = useMutation(
    ['facebook-authorization'],
    (values: IAppleAuthorizeRequestDto) => {
      abortControllerRef.current = new AbortController();
      return appleAuthorization({ values, signal: abortControllerRef?.current?.signal });
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

  const baseUrlEnvironmentDependent = window.location.href.split('/').slice(0, -1).join('/');

  React.useEffect(() => {
    if (clientID) {
      (window as any).AppleID.auth.init({
        clientId: clientID,
        scope: 'name email',
        redirectURI: `${baseUrlEnvironmentDependent}/${
          from === AppleAuthCodeFromEnum.REGISTER ? 'registration' : 'login'
        }`,
        usePopup: true
      });
    }
  }, [baseUrlEnvironmentDependent, registrationFlow, clientID]);

  const registerViaApple = React.useCallback((values: IAppleAuthorizeRequestDto) => {
    if (values) sendAuthorizeViaApple(values);
  }, []);

  document.addEventListener('AppleIDSignInOnSuccess', (event: any) => {
    // Handle successful response.
    const code = event.detail?.authorization?.id_token;
    if (code)
      if (from === AppleAuthCodeFromEnum.REGISTER) {
        queryClient.setQueryData(['apple-auth-code'], code);
        navigate(ApplicationLocations.PICK_USERNAME, {
          state: {
            type: PickUsernameTypeEnum.APPLE
          }
        });
      } else {
        sendAuthorizeViaApple({
          auth_code: code
        });
      }
  });

  // Listen for authorization failures.
  document.addEventListener('AppleIDSignInOnFailure', (event: any) => {
    // Handle error.
    console.error(event.detail.error);
    toast.error(
      registrationFlow ? 'Registration via Apple failed' : 'Failed to sign in with Apple'
    );
  });

  return {
    isLoading,
    registerViaApple
  };
};
