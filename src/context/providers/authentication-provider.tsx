import { subscribeBrowserPush } from 'api/notifications/requests';
import axios from 'axios';
import React from 'react';
import { useServiceInterceptors } from '../../hooks/use-service-interceptors';
import { IPerson } from '../../types/activities/activity.dto';
import { setAuthToken } from '../../utils/token.util';

interface IAuthenticationContext {
  stateToken: string | null;
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo?: IPerson | undefined;
  setUserInfo?: React.Dispatch<React.SetStateAction<IPerson | undefined>>;
  isFirstTimeLogin?: boolean;
  setIsFirstTimeLogin?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  googleTokenClient: any;
  instagramCode: string | null;
  setInstagramCode: React.Dispatch<React.SetStateAction<string | null>>;
}

declare global {
  interface FormData {
    getHeaders: () => { [key: string]: string };
  }
}

FormData.prototype.getHeaders = () => {
  return { 'Content-Type': 'multipart/form-data' };
};

export const CLIENT_ID =
  '1080578312208-8vm5lbg7kctt890d0lagj46sphae7odu.apps.googleusercontent.com';

export const SCOPE = 'https://www.googleapis.com/auth/calendar';

export const AuthenticationContext = React.createContext<IAuthenticationContext>(
  {} as IAuthenticationContext
);

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateToken, setStateToken] = React.useState<null | string>(null);
  const [userInfo, setUserInfo] = React.useState<IPerson | undefined>();
  const [googleTokenClient] = React.useState<any>();
  const [instagramCode, setInstagramCode] = React.useState<string | null>(null);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = React.useState<boolean | undefined>(false);

  React.useEffect(() => {
    if (userInfo?.id) {
      // TODO: moreover IOS requires some user interaction before subscription
      subscribeBrowserPush(Number(userInfo?.id));
    }
  }, [userInfo?.id]);

  console.log(userInfo);

  useServiceInterceptors({ setStateToken, setUserInfo, userId: userInfo?.id });
  React.useEffect(() => {
    if (stateToken) {
      setAuthToken(stateToken);
    }
  }, [stateToken]);

  React.useEffect(() => {
    // if I get instagram code, exchange it for access token
    if (instagramCode) {
      const form = new FormData();
      form.append('client_id', '738841197888411');
      form.append('client_secret', 'a6f0b1f9dc0a180df400e4205addf792');
      form.append('grant_type', 'authorization_code');
      form.append('redirect_uri', 'https://localhost:3000/profile/');
      form.append('code', instagramCode);

      axios.post('https://api.instagram.com/oauth/access_token', form, {
        headers: {
          ...form.getHeaders()
        }
      });
    }
  }, [instagramCode]);

  return (
    <AuthenticationContext.Provider
      value={{
        stateToken,
        setStateToken,
        userInfo,
        setUserInfo,
        googleTokenClient,
        instagramCode,
        setInstagramCode,
        isFirstTimeLogin,
        setIsFirstTimeLogin
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
