import { AuthenticationContext } from '../assets/theme/authentication-provider'
import BottomNavigator from '../components/bottom-navigator'
import { getAuthToken } from '../utils/token.util'
import React from 'react'
import Routes from '../routes/routes'
import OffliHeader from '../components/offli-header'
import { useLocation } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
interface ILayoutProps {
  children?: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { stateToken } = React.useContext(AuthenticationContext)
  const location = useLocation()

  const [displayHeader, setDisplayHeader] = React.useState(true)

  React.useEffect(() => {
    if (location?.pathname === ApplicationLocations.SETTINGS) {
      setDisplayHeader(false)
    } else {
      setDisplayHeader(true)
    }
  }, [location])
  return (
    <>
      {/* conditional rendering when token is received */}
      {stateToken && displayHeader && <OffliHeader />}
      <Routes />
      {stateToken && <BottomNavigator />}
    </>
  )
}
