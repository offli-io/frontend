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
        maxHeight: { xs: 100, md: 200 },
        maxWidth: { xs: 150, md: 350 },
      }}
      alt="The house from the offer."
      src={logo}
    />
  )
}

export default Logo
