import BottomNavigator from '../components/bottom-navigator'
import { getAuthToken } from '../utils/token.util'
import React from 'react'
import Routes from '../routes/routes'
import OffliHeader from '../components/offli-header'
import { useLocation } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { Box } from '@mui/material'
interface ILayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const token = getAuthToken()
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        gridTemplateRows: '10% 80% 10%',
      }}
    >
      {/* conditional rendering when token is received */}
      {stateToken && displayHeader && <OffliHeader sx={{ flex: 1 }} />}
      <Box sx={{ overflow: 'scroll' }}>
        <Routes />
      </Box>
      {stateToken && <BottomNavigator sx={{ flex: 1 }} />}
    </Box>
  )
}
