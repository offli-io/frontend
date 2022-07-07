import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import OffliHeader from '../components/offli-header'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import GppGoodIcon from '@mui/icons-material/GppGood'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
const ProfileEmptyScreen = () => {
  const [username] = useState('emma.smith')
  const [feedbackNumber] = useState(0)
  return (
    <Box
      sx={{
        height: '100%',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <OffliHeader />
      <Box
        sx={{
          height: '15%',
          width: '100%',
          backgroundColor: '#C9C9C9',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'right',
        }}
      >
        <CreateOutlinedIcon
          color="primary"
          sx={{
            position: 'relative',
            bottom: '0px',
            right: 0,
            mr: 1,
            mb: 1,
            fontSize: '20px',
          }}
        />
      </Box>
      <Box
        sx={{
          height: '60px',
          width: '60px',
          backgroundColor: '#C9C9C9',
          borderRadius: '50%',
          mt: -4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid white',
        }}
      >
        <CreateOutlinedIcon color="primary" sx={{ fontSize: '20px' }} />
      </Box>
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mt: 1 }}>
        {username}
      </Typography>
      <Box
        sx={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            About me
          </Typography>
          <CreateOutlinedIcon color="primary" sx={{ fontSize: '20px' }} />
        </Box>
        <Typography sx={{ width: '90%', mt: 1 }}>
          Introduce yourself, edit about you to let others know more about
          you...
        </Typography>
        <Typography
          align="left"
          sx={{ width: '100%', fontSize: '18px', fontWeight: 'bold', mt: 2 }}
        >
          My activity this month
        </Typography>
        <Typography sx={{ width: '90%', mt: 1 }}>None so far.</Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            My feedback
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <GppGoodIcon color="primary" />
            <Typography>{feedbackNumber}</Typography>
          </Box>
        </Box>
        <Box
          sx={{ width: '90%', mt: 1, display: 'flex', alignItems: 'center' }}
        >
          <ThumbUpIcon color="primary" />
          <Typography sx={{ ml: 1.5 }}>
            I am participating in scheduled activities
          </Typography>
        </Box>
        <Box
          sx={{ width: '90%', mt: 1, display: 'flex', alignItems: 'center' }}
        >
          <FavoriteRoundedIcon color="primary" />
          <Typography sx={{ ml: 1.5 }}>
            Enjoyed time together doing planned activities
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileEmptyScreen
