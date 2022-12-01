import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import MaximizeRoundedIcon from '@mui/icons-material/MaximizeRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import OffliButton from '../components/offli-button'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import image from '../assets/img/undraw_super_thank_you_blue.svg'
import { DrawerContext } from '../assets/theme/drawer-provider'

const TestScreen = () => {
  const { toggleDrawer } = React.useContext(DrawerContext)

  React.useEffect(
    () =>
      toggleDrawer({
        open: true,
        content: <Box sx={{ height: 200 }}>Drawer content</Box>,
      }),
    []
  )
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography>This is testing screen for components</Typography>
      {/* <SwipeableDrawer
        anchor="bottom"
        open={true}
        onOpen={() => console.log('wtf')}
        onClose={() => console.log('close')}
      >
        <Box sx={{ height: 200 }}>Drawer content</Box>
      </SwipeableDrawer> */}
    </Box>
  )
}

export default TestScreen
