import React from 'react'
import { Box } from '@mui/material'
import logo from '../assets/img/logoPurple.png'

const Logo: React.FC = () => {
  return (
    <Box
      component="img"
      sx={{
        //   height: 233,
        //   width: 350,
        maxHeight: { xs: 120, md: 220 },
        maxWidth: { xs: 170, md: 360 },
      }}
      alt="The house from the offer."
      src={logo}
    />
  )
}

export default Logo
