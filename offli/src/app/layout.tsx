import { AuthenticationContext } from '../assets/theme/authentication-provider'
import BottomNavigator from '../components/bottom-navigator'
import { getAuthToken } from '../utils/token.util'
import React from 'react'
import Routes from '../routes/routes'
import OffliHeader from '../components/offli-header'
import { useLocation } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { Box } from '@mui/material'
import { HEADER_HEIGHT } from '../utils/common-constants'
interface ILayoutProps {
  children?: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { stateToken } = React.useContext(AuthenticationContext)
  const location = useLocation()

  const [displayHeader, setDisplayHeader] = React.useState(true)

  // React.useEffect(() => {
  //   if (location?.pathname === ApplicationLocations.SETTINGS) {
  //     setDisplayHeader(false)
  //   } else {
  //     setDisplayHeader(true)
  //   }
  // }, [location])
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'stretch',
        // gridTemplateRows: !displayHeader ? '92% 8%' : '10% 82% 8%',
        overflow: 'hidden',
      }}
    >
      {/* conditional rendering when token is received */}

      {stateToken && displayHeader && <OffliHeader sx={{ width: '100%' }} />}
      <Box
        sx={{
          overflow: 'scroll',
          width: '100%',
          height: '100%',
          // pt: HEADER_HEIGHT / 8,
          // pb: HEADER_HEIGHT / 8,
        }}
      >
        <Box sx={{ mt: HEADER_HEIGHT / 8 }}>
          <Routes />
        </Box>
      </Box>
      {stateToken && <BottomNavigator sx={{ height: '100%' }} />}
    </Box>
  )
}
