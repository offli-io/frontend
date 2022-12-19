import React from 'react'
import { Box } from '@mui/material'
import BackHeader from '../../components/back-header'
import { AuthenticationContext } from '../../assets/theme/authentication-provider'
import { setAuthToken } from '../../utils/token.util'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApplicationLocations } from '../../types/common/applications-locations.dto'

export interface ICustomizedLocationState {
  from?: string
}

const NotificationsScreen = () => {
  const [darkMode, setDarkMode] = React.useState(false)
  const { setStateToken } = React.useContext(AuthenticationContext)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location?.state as ICustomizedLocationState
  const { from } = state

  const handleLogout = React.useCallback(() => {
    //TODO double check if any security issues aren't here I am not sure about using tokens from 2 places
    setStateToken(null)
    setAuthToken(undefined)
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate(ApplicationLocations.LOGIN)
  }, [setStateToken])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}
    >
      <BackHeader title="Notifications" sx={{ mb: 2 }} to={from} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        Notifications
      </Box>
    </Box>
  )
}

export default NotificationsScreen
