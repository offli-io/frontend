import { Box } from '@mui/material'
import React from 'react'
import { IActivity } from '../types/activities/activity.dto'

interface IProps {
  activity: IActivity
}

const ActivityDetailsCard: React.FC<IProps> = ({ activity }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '45%',
        backgroundImage: `url(${require('../assets/img/dune.webp')})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      asasas
    </Box>
  )
}

export default ActivityDetailsCard
