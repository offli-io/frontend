import { AuthenticationContext } from '../assets/theme/authentication-provider'
import BottomNavigator from '../components/bottom-navigator'
import React from 'react'
import Routes from '../routes/routes'
import OffliHeader from '../components/offli-header'
import { useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'stretch',
        overflow: 'hidden',
      }}
    >
      {stateToken && displayHeader && <OffliHeader sx={{ width: '100%' }} />}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'scroll',
        }}
      >
        <Routes />
      </Box>
      {stateToken && <BottomNavigator sx={{ height: '100%' }} />}
    </Box>
  )
}
