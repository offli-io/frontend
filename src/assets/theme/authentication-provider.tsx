import axios from "axios";
import jwt_decode from "jwt-decode";
import React from "react";
import { useServiceInterceptors } from "../../hooks/use-service-interceptors";
import { IPersonExtended } from "../../types/activities/activity.dto";
import { setAuthToken } from "../../utils/token.util";

// const event = {
//   summary: 'Hello World',
//   location: '',
//   start: {
//     dateTime: '2022-12-28T09:00:00-07:00',
//     timeZone: 'America/Los_Angeles',
//   },
//   end: {
//     dateTime: '2022-12-28T17:00:00-07:00',
//     timeZone: 'America/Los_Angeles',
//   },
//   // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
//   attendees: [],
//   reminders: {
//     useDefault: false,
//     overrides: [
//       { method: 'email', minutes: 24 * 60 },
//       { method: 'popup', minutes: 10 },
//     ],
//   },
// }

interface IAuthenticationContext {
  stateToken: string | null;
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo?: IPersonExtended | undefined;
  setUserInfo?: React.Dispatch<
    React.SetStateAction<IPersonExtended | undefined>
  >;
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
  return { "Content-Type": "multipart/form-data" };
};

export const CLIENT_ID =
  "1080578312208-8vm5lbg7kctt890d0lagj46sphae7odu.apps.googleusercontent.com";

export const SCOPE = "https://www.googleapis.com/auth/calendar";

export const AuthenticationContext =
  React.createContext<IAuthenticationContext>({} as IAuthenticationContext);

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useServiceInterceptors();
  //one way to authenticate but I think token refresh and handling will be done by keycloak

  const [stateToken, setStateToken] = React.useState<null | string>(null);
  const [userInfo, setUserInfo] = React.useState<IPersonExtended | undefined>();
  const [googleTokenClient] = React.useState<any>();
  const [instagramCode, setInstagramCode] = React.useState<string | null>(null);

  //another way just to inform with boolean,
  //const [authenticated, setIsAuthenticated] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (stateToken) {
      setAuthToken(stateToken);
    }
  }, [stateToken]);

  async function handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
    const decoded: any = jwt_decode(response.credential);
    console.log(decoded);
  }

  React.useEffect(() => {
    // if I get instagram code, exchange it for access token
    if (instagramCode) {
      const form = new FormData();
      form.append("client_id", "738841197888411");
      form.append("client_secret", "a6f0b1f9dc0a180df400e4205addf792");
      form.append("grant_type", "authorization_code");
      form.append("redirect_uri", "https://localhost:3000/profile/");
      form.append("code", instagramCode);

      axios.post("https://api.instagram.com/oauth/access_token", form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      // axios.post(
      //   'https://api.instagram.com/oauth/access_token',
      //   qs.stringify({
      //     client_id: '738841197888411',
      //     client_secret: 'a6f0b1f9dc0a180df400e4205addf792',
      //     grant_type: 'authorization_code',
      //     redirect_uri: 'https://terapartners.sk/',
      //     code: instagramCode,
      //   }),
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   }
      // )
      // 'content-type': 'multipart/form-data',
      //host: 'api.instagram.com',
      // {
      //   params: {
      //     client_id: '738841197888411',
      //     client_secret: 'a6f0b1f9dc0a180df400e4205addf792',
      //     grant_type: 'authorization_code',
      //     redirect_uri: 'https://localhost:3000/profile/',
      //     code: instagramCode,
      //   },
      // }
      //       curl -X POST \
      // https://api.instagram.com/oauth/access_token \
      // -F client_id=738841197888411 \
      // -F client_secret=a6f0b1f9dc0a180df400e4205addf792 \
      // -F grant_type=authorization_code \
      // -F redirect_uri=https://localhost:3000/profile/ \
      // -F code=AQB1R3iYzvqysmfF6T2h-rUM-9wP3gUvD7hSsno6ZlKHCh44A508g1N7bQiNbZAte_02sA0rMaCWwqyE1cgB3TiYjrm-0RLUcsJEbCUfpt80hSzDwHwl27LN9cUt6yirUj2xpXXB8TOxWmb0dCQid_ybmPdFOwgNn56_Jya-gn7IAcSKvn1U6WrM9yDhB0MdiozQXyEpY1oCKBA0VfSW_-qo9Ei0kq8bETEdo3cbY5xpkA
      // )
    }
  }, [instagramCode]);

  React.useEffect(() => {
    /* global google */
    google?.accounts?.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google?.accounts?.id.renderButton(
      document.getElementById("signIn") as HTMLElement,
      {
        type: "standard",
        theme: "outline",
        size: "large",
        width: "270px",
      }
    );

    // TODO old way maybe if I can call this with params I can use it later
    // setGoogleTokenClient(
    //   google.accounts.oauth2.initTokenClient({
    //     client_id: CLIENT_ID,
    //     scope: SCOPE,
    //     callback: async tokenResponse => {
    //       console.log(tokenResponse)
    //       if (tokenResponse && tokenResponse.access_token) {
    //         //TODO calendarId is logged in user mail,
    //         const promise = addEventToCalendar(
    //           'thefaston@gmail.com',
    //           tokenResponse?.access_token,
    //           event
    //         )
    //         console.log(promise)
    //       }
    //     },
    //   })
    // )
  }, []);
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
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
