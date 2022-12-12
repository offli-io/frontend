import React from 'react'
import { Box, Typography } from '@mui/material'
import lottie from 'lottie-web'
import animationData from '../../assets/animations/celebration-animation.json'

import activityCreatedImg from '../../assets/img/activity-created.svg'

interface IActivityCreatedScreenProps {
  onDismiss: () => void
}

interface LottieProps {
  animationData: any
  width: number
  height: number
}

const ActivityCreatedScreen: React.FC<IActivityCreatedScreenProps> = ({
  onDismiss,
}) => {
  const element = React.useRef<HTMLDivElement>(null)
  const lottieInstance = React.useRef<any>()
  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 2500)
    if (element.current) {
      lottieInstance.current = lottie.loadAnimation({
        animationData,
        container: element.current,
      })
    }

    return () => {
      lottieInstance.current?.destroy()
      clearTimeout(timer)
    }
  }, [])
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px !important;',
      }}
    >
      <Box sx={{ position: 'absolute', zIndex: 500 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Activity created !
        </Typography>
        <img
          src={activityCreatedImg}
          alt="Offli logo"
          style={{ height: '150px' }}
        />
      </Box>
      <Box
        ref={element}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        // className="backgroundImage"
        onTouchStart={() => onDismiss()}
      />
    </Box>
  )
}

export default ActivityCreatedScreen
