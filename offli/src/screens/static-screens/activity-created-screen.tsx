import React from 'react'
import { Box, Typography } from '@mui/material'

import activityCreatedImg from '../../assets/img/activity-created.svg'

interface IActivityCreatedScreenProps {
  onDismiss: () => void
}

const ActivityCreatedScreen: React.FC<IActivityCreatedScreenProps> = ({
  onDismiss,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 2500)

    return () => clearTimeout(timer)
  }, [])
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 8,
      }}
      // className="backgroundImage"
      onTouchStart={() => onDismiss()}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Activity created !
      </Typography>
      <img
        src={activityCreatedImg}
        alt="Offli logo"
        style={{ height: '150px' }}
      />
    </Box>
  )
}

export default ActivityCreatedScreen
