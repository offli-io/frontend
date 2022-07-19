import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { IActivityProps } from '../types/common/types'
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaidIcon from '@mui/icons-material/Paid'
import PlaceIcon from '@mui/icons-material/Place'
import TimerIcon from '@mui/icons-material/Timer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonIcon from '@mui/icons-material/Person'

const MyActivityCard: React.FC<IActivityProps> = ({
  //   id,
  name,
  price,
  location,
  datetime,
  members,
  accepted,
  capacity,
}) => {
  return (
    <Box
      sx={{
        height: '22vh',
        width: '80vw',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        border: '1px solid lightgrey',
        borderRadius: '16px',
        mb: 2,
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
          {name}
        </Typography>
        <IconButton>
          <MoreHorizIcon
            color="primary"
            sx={{ fontSize: '20px', mt: -2, mr: -1 }}
          />
        </IconButton>
      </Box>

      <Box
        sx={{
          mt: 1,
          ml: 1,
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <PaidIcon color="primary" sx={{ fontSize: '20px' }} />
          <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
            &nbsp;{price}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <PlaceIcon color="primary" sx={{ fontSize: '20px' }} />
          <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
            {location}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TimerIcon color="primary" sx={{ fontSize: '18px', mt: 0.3 }} />
          <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
            &nbsp;{datetime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {members.map(member => {
            return (
              <Typography
                key={member}
                variant="h6"
                sx={{ fontSize: '14px', mb: 1 }}
              >
                {member}&nbsp;
              </Typography>
            )
          })}
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <PersonIcon sx={{ fontSize: '16px', color: 'gray', mb: 0.3 }} />
          <Typography variant="h6" sx={{ fontSize: '14px', color: 'gray' }}>
            {accepted}/{capacity}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default MyActivityCard
