import { ReactElement, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { CustomizationProvider } from '../assets/theme/customization-provider'
import BottomNavigator from '../components/bottom-navigator'
import OffliHeader from '../components/offli-header'
import { getAuthToken } from '../utils/token.util'
import Routes from './routes'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBuddies, getUsers } from '../api/activities/requests'

const Router: React.FC = (): ReactElement => {
  const { stateToken, userInfo, setUserInfo } = React.useContext(
    AuthenticationContext
  )
  const token = getAuthToken()

  const userInfoQuery = useQuery(
    ['user-info', userInfo?.username],
    () => getUsers(userInfo?.username),
    {
      enabled: !!userInfo?.username,
      onSuccess: data => {
        setUserInfo && setUserInfo(data?.data)
      },
    }
  )

  return (
    <CustomizationProvider>
      <Suspense fallback={<p>Loading ...</p>}>
        <BrowserRouter>
          {/* conditional rendering when token is received */}
          {stateToken && <OffliHeader />}
          <Routes />
          {stateToken && <BottomNavigator />}
        </BrowserRouter>
      </Suspense>
    </CustomizationProvider>
  )
}

export default Router
