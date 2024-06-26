import { subscribeBrowserPush } from 'api/notifications/requests';
import axios from 'axios';
import React from 'react';
import { FacebookProvider } from 'react-facebook';
import { UAParser } from 'ua-parser-js';
import { FB_APP_ID } from 'utils/common-constants';
import { useServiceInterceptors } from '../../../hooks/auth/use-service-interceptors';
import { IPerson } from '../../../types/activities/activity.dto';
import { setAuthToken } from '../../../utils/token.util';

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
  const userIdFromStorage = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = React.useState<IPerson | undefined>(
    userIdFromStorage ? { id: Number(userIdFromStorage) } : undefined
  );
  const [googleTokenClient] = React.useState<any>();
  const [instagramCode, setInstagramCode] = React.useState<string | null>(null);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = React.useState<boolean | undefined>(false);
  const parser = new UAParser();

  React.useEffect(() => {
    if (userInfo?.id) {
      let deviceName = 'Unknown';
      const device = parser?.getDevice();
      if (device && (device.vendor || device.model)) {
        if (device.model) {
          deviceName = device.vendor ? `${device.vendor} ${device.model}` : device.model;
        }
        if (device.type) {
          deviceName = `${deviceName} ${device.type}`;
        }
        const deviceOSVersion = parser?.getOS()?.version;
        if (deviceOSVersion) {
          deviceName = `${deviceName}, OS ${deviceOSVersion}`;
        }
      }
      subscribeBrowserPush(Number(userInfo?.id), deviceName);
    }
  }, [userInfo?.id, parser]);

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
      <FacebookProvider appId={FB_APP_ID}>{children}</FacebookProvider>
    </AuthenticationContext.Provider>
  );
};
