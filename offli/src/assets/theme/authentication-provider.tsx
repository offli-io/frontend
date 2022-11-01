import React from 'react'

interface IAuthenticationContext {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthenticationContext = React.createContext<IAuthenticationContext>(
  {} as IAuthenticationContext
)

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
    <AuthenticationContext.Provider value={{ token, setToken }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
