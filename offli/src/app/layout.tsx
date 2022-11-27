import { AuthenticationContext } from '../assets/theme/authentication-provider'
import BottomNavigator from '../components/bottom-navigator'
import { getAuthToken } from '../utils/token.util'
import React from 'react'
import Routes from '../routes/routes'
import OffliHeader from '../components/offli-header'
import { useLocation } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { Box } from '@mui/material'
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
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: stateToken ? 'grid' : 'flex',
        alignItems: 'center',
        justifyContent: 'stretch',
        gridTemplateRows: !displayHeader ? '92% 8%' : '10% 82% 8%',
      }}
    >
      {/* conditional rendering when token is received */}
      {stateToken && displayHeader && <OffliHeader sx={{ height: '100%' }} />}
      <Box sx={{ overflow: 'scroll', width: '100%', height: '100%' }}>
        <Routes />
      </Box>
      {stateToken && <BottomNavigator sx={{ height: '100%' }} />}
    </Box>
  )
}
