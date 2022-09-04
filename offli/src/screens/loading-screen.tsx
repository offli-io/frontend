import React from 'react'
import { Box } from '@mui/material'

import offliLogo from '../assets/img/logoPurple.png'

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      // className="backgroundImage"
    >
      <img
        src={offliLogo}
        alt="Offli logo"
        style={{ height: '80px', marginTop: '-50px' }}
      />
    </Box>
  )
}

export default LoadingScreen
