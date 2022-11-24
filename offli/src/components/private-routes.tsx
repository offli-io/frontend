import { Outlet, Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import React from 'react'
import { getAuthToken } from '../utils/token.util'

export const PrivateRoutes = () => {
  const { stateToken, setStateToken } = React.useContext(AuthenticationContext)
  const token = getAuthToken()

  React.useEffect(() => {
    if (!stateToken && !!token) {
      setStateToken(token)
    }
  }, [stateToken, token])

  const hasToken = stateToken || token

  return hasToken ? <Outlet /> : <Navigate to="/" />
}
