import { ReactElement, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { CustomizationProvider } from '../assets/theme/customization-provider'
import BottomNavigator from '../components/bottom-navigator'
import OffliHeader from '../components/offli-header'
import { getAuthToken } from '../utils/token.util'
import Routes from './routes'
import React from 'react'

const Router: React.FC = (): ReactElement => {
  const { stateToken, setStateToken } = React.useContext(AuthenticationContext)
  const token = getAuthToken()

  React.useEffect(() => {
    if (!stateToken && !!token) {
      setStateToken(token)
    }
  }, [stateToken, token])

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
