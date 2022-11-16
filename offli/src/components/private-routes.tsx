import { Outlet, Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { getAuthToken } from '../utils/token.util'
import React from 'react'

export const PrivateRoutes = () => {
  const { stateToken } = React.useContext(AuthenticationContext)
  return stateToken ? <Outlet /> : <Navigate to="/login" />
}
