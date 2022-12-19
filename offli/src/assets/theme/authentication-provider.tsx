import React from 'react'
import { useServiceInterceptors } from '../../hooks/use-service-interceptors'
import { setAuthToken } from '../../utils/token.util'
import { IPerson, IPersonExtended } from '../../types/activities/activity.dto'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { addEventToCalendar } from '../../api/google/requests'

const event = {
  summary: 'Hello World',
  location: '',
  start: {
    dateTime: '2022-12-28T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2022-12-28T17:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },
      { method: 'popup', minutes: 10 },
    ],
  },
}

interface IAuthenticationContext {
  stateToken: string | null
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>
  userInfo?: IPersonExtended | undefined
  setUserInfo?: React.Dispatch<
    React.SetStateAction<IPersonExtended | undefined>
  >
  googleTokenClient: any
}

const CLIENT_ID =
  '1080578312208-8vm5lbg7kctt890d0lagj46sphae7odu.apps.googleusercontent.com'

const SCOPE = 'https://www.googleapis.com/auth/calendar'

export const AuthenticationContext =
  React.createContext<IAuthenticationContext>({} as IAuthenticationContext)

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useServiceInterceptors()
  //one way to authenticate but I think token refresh and handling will be done by keycloak

  const [stateToken, setStateToken] = React.useState<null | string>(null)
  const [userInfo, setUserInfo] = React.useState<IPersonExtended | undefined>()
  const [googleTokenClient, setGoogleTokenClient] = React.useState<any>()

  //another way just to inform with boolean,
  const [authenticated, setIsAuthenticated] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (stateToken) {
      setAuthToken(stateToken)
    }
  }, [stateToken])

  async function handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential)
    const decoded: any = jwt_decode(response.credential)
    console.log(decoded)
  }

  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    })

    google.accounts.id.renderButton(
      document.getElementById('signIn') as HTMLElement,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: '270px',
      }
    )

    setGoogleTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: async tokenResponse => {
          console.log(tokenResponse)
          if (tokenResponse && tokenResponse.access_token) {
            //TODO calendarId is logged in user mail,
            const promise = addEventToCalendar(
              'thefaston@gmail.com',
              tokenResponse?.access_token,
              event
            )
            console.log(promise)
          }
        },
      })
    )
  }, [])
  return (
    <AuthenticationContext.Provider
      value={{
        stateToken,
        setStateToken,
        userInfo,
        setUserInfo,
        googleTokenClient,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
