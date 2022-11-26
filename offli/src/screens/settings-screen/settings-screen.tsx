import React from 'react'
import { Box, Typography } from '@mui/material'
import BackHeader from '../../components/back-header'

const SettingsScreen = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <BackHeader title="Settings" />
    </Box>
  )
}

export default SettingsScreen
