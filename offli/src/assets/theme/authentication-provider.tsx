import React from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { useServiceInterceptors } from '../../hooks/use-service-interceptors'
import { setAuthToken } from '../../utils/token.util'
import { IPerson, IPersonExtended } from '../../types/activities/activity.dto'
import { DEFAULT_KEYCLOAK_URL } from '../config'

interface IAuthenticationContext {
  stateToken: string | null
  setStateToken: React.Dispatch<React.SetStateAction<string | null>>
  userInfo?: IPersonExtended | undefined
  setUserInfo?: React.Dispatch<
    React.SetStateAction<IPersonExtended | undefined>
  >
}

export const AuthenticationContext =
  React.createContext<IAuthenticationContext>({} as IAuthenticationContext)

const keycloakConfig = new Keycloak({
  url: `${DEFAULT_KEYCLOAK_URL}/auth`,
  realm: 'Offli',
  clientId: 'Offli-realm',
})

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useServiceInterceptors()
  //one way to authenticate but I think token refresh and handling will be done by keycloak

  const [stateToken, setStateToken] = React.useState<null | string>(null)
  const [userInfo, setUserInfo] = React.useState<IPersonExtended | undefined>()

  //another way just to inform with boolean,
  const [authenticated, setIsAuthenticated] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (stateToken) {
      setAuthToken(stateToken)
    }
  }, [stateToken])
  return (
    <ReactKeycloakProvider
      authClient={keycloakConfig}
      onTokens={() => console.log('jesssss')}
      initOptions={{
        onLoad: 'login-required',
        scope: 'openid profile roles',
        response: 'code',
        profile: 'openid-connect',
      }}
    >
      <AuthenticationContext.Provider
        value={{ stateToken, setStateToken, userInfo, setUserInfo }}
      >
        {children}
      </AuthenticationContext.Provider>
    </ReactKeycloakProvider>
  )
}
