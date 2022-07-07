import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import MaximizeRoundedIcon from '@mui/icons-material/MaximizeRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import OffliButton from '../components/offli-button'

const WelcomeScreen = () => {
  const [username] = useState('emma.smith')
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //   justifyContent: 'center',
      }}
    >
      <MaximizeRoundedIcon
        sx={{ color: 'lightgrey', mt: 4, transform: 'scale(2.5)' }}
      />
      <Typography
        align="center"
        variant="h3"
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      >
        Welcome, <br />{' '}
        <Box sx={{ color: 'black', fontSize: '18px' }}>{username}!</Box>
      </Typography>
      <FavoriteRoundedIcon
        sx={{ color: 'primary.main', transform: 'scale(2)', mt: 4 }}
      />
      <Typography
        align="center"
        variant="subtitle2"
        sx={{
          fontSize: '16px',
          mt: 4,
        }}
      >
        <b>Thank you,</b> <br />
        your registration was successful.
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ fontSize: '16px', width: '70%', fontWeight: 'bold', mt: 2 }}
      >
        We are happy you have joined the network of people who wants to live
        fully and energized!
      </Typography>
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 'bold',
          mt: 3,
          mb: -1,
          ml: -20,
          color: 'primary.main',
        }}
      >
        Now you can:
      </Typography>
      <ul style={{ width: '70%', fontSize: '16px' }}>
        <li>
          <Typography>Create & search for activities,</Typography>
        </li>
        <li>
          <Typography>Join the forming groups,</Typography>
        </li>
        <li>
          <Typography>See your scheduled activities,</Typography>
        </li>
        <li>
          <Typography>Enjoy time with your buddies,</Typography>
        </li>
        <li>
          <Typography>
            and Leave feedback on how was the activities, and create safe
            community
          </Typography>
        </li>
      </ul>
      <OffliButton
        sx={{ width: '70%', mt: 2, textTransform: 'none', fontSize: '18px' }}
        type="button"
      >
        Let`s get started!
      </OffliButton>
    </Box>
  )
}

export default WelcomeScreen
