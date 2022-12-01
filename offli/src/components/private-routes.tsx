import { Outlet, Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import React from 'react'
import { getAuthToken } from '../utils/token.util'

export const PrivateRoutes = () => {
  const { stateToken, setStateToken, setUserInfo, userInfo } = React.useContext(
    AuthenticationContext
  )
  const token = getAuthToken()
  const usernameFromStorage = localStorage.getItem('username')

  React.useEffect(() => {
    if (!stateToken && !!token) {
      setStateToken(token)
    }
  }, [stateToken, token])

  React.useEffect(() => {
    if (!userInfo && !!usernameFromStorage) {
      setUserInfo && setUserInfo({ username: usernameFromStorage })
    }
  })

  const hasToken = stateToken || token

  return hasToken ? <Outlet /> : <Navigate to="/" />
}
