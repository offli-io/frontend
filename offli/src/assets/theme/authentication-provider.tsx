import React from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'

interface IAuthenticationContext {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthenticationContext = React.createContext<IAuthenticationContext>(
  {} as IAuthenticationContext
)

const keycloakConfig = new Keycloak({
  url: 'http://localhost:8082/auth',
  realm: 'Offli',
  clientId: 'Offli-realm',
  
})

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  //one way to authenticate but I think token refresh and handling will be done by keycloak

  const [token, setToken] = React.useState<null | string>(null)

  //another way just to inform with boolean,
  const [authenticated, setIsAuthenticated] = React.useState<boolean>(false)
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
      <AuthenticationContext.Provider value={{ token, setToken }}>
        {children}
      </AuthenticationContext.Provider>
    </ReactKeycloakProvider>
  )
}
