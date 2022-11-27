import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { IActivity } from '../types/activities/activity.dto'
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaidIcon from '@mui/icons-material/Paid'
import PlaceIcon from '@mui/icons-material/Place'
import TimerIcon from '@mui/icons-material/Timer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { getActivity } from '../api/activities/requests'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'

interface IProps {
  activityId: string
}

const MyActivityCard: React.FC<IProps> = ({ activityId }) => {
  const { data } = useQuery(
    ['activity', activityId],
    () => getActivity(activityId),
    {
      enabled: !!activityId,
    }
  )

  const activity = data?.data?.activity

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '99%',
        height: '37%',
        marginTop: '2%',
        marginBottom: '2%',
        borderRadius: '12px',
        backgroundImage: `url(${require('../assets/img/danodrevo.jfif')})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'flex-end',
        color: 'white',
      }}
      onClick={() =>
        navigate(`${ApplicationLocations.ACTIVITY_ID}/${activity?.id}`)
      }
    >
      <Box
        sx={{
          height: '25%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '3% 3% 2% 3%',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          backdropFilter: 'blur(2px)',
          // position: 'absolute',
          // bottom: 0,
        }}
      >
        <Box sx={{ height: '100%' }}>
          <Typography
            variant="h4"
            sx={{
              textTransform: 'uppercase',
              fontWeight: 400,
              lineHeight: 0.6,
            }}
          >
            {activity?.title}
          </Typography>
          {activity?.location?.name ? (
            <Typography
              variant="subtitle2"
              sx={{ fontweight: 200, fontSize: 11, lineHeight: 2 }}
            >
              {activity?.location?.name}
            </Typography>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 11, visibility: 'hidden', lineHeight: 2 }}
            >
              pica
            </Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              mt: -0.5,
            }}
          >
            <Box>
              <LockIcon sx={{ fontSize: '14px' }} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <PeopleAltIcon sx={{ fontSize: '16px', ml: 1.5, mr: 0.5 }} />
              {activity?.limit ? (
                <Typography
                  variant="subtitle2"
                  sx={{ lineHeight: 1.1, fontWeight: 200 }}
                >
                  {activity?.participants?.length}/{activity?.limit}
                </Typography>
              ) : (
                <Typography variant="subtitle2">
                  {activity?.participants?.length} 0
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1, fontSize: '24px' }}>
              20
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                lineHeight: 1,
                fontSize: '12px',
                fontWeight: 'lighter',
                letterSpacing: 0,
              }}
            >
              September
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ lineHeight: 1.1, fontSize: '20px', fontWeight: 200 }}
            >
              17:00
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>

    // <Box
    //   sx={{
    //     height: '22vh',
    //     width: '80vw',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignContent: 'flex-start',
    //     justifyContent: 'flex-start',
    //     border: '1px solid lightgrey',
    //     borderRadius: '16px',
    //     mb: 2,
    //     p: 2,
    //   }}
    // >
    //   <Box
    //     sx={{
    //       width: '100%',
    //       display: 'flex',
    //       justifyContent: 'space-between',
    //     }}
    //   >
    //     <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
    //       {activity.title}
    //     </Typography>
    //     <IconButton>
    //       <MoreHorizIcon
    //         color="primary"
    //         sx={{ fontSize: '20px', mt: -2, mr: -1 }}
    //       />
    //     </IconButton>
    //   </Box>

    //   <Box
    //     sx={{
    //       mt: 1,
    //       ml: 1,
    //     }}
    //   >
    //     <Box sx={{ display: 'flex' }}>
    //       <PaidIcon color="primary" sx={{ fontSize: '20px' }} />
    //       <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
    //         &nbsp;10
    //       </Typography>
    //     </Box>
    //     <Box sx={{ display: 'flex' }}>
    //       <PlaceIcon color="primary" sx={{ fontSize: '20px' }} />
    //       <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
    //         {activity?.location?.name}
    //       </Typography>
    //     </Box>

    //     <Box
    //       sx={{
    //         display: 'flex',
    //       }}
    //     >
    //       <TimerIcon color="primary" sx={{ fontSize: '18px', mt: 0.3 }} />
    //       {/* <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
    //         &nbsp;{datetime.toLocaleTimeString()}
    //       </Typography> */}
    //     </Box>
    //   </Box>
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //       justifyContent: 'space-between',
    //     }}
    //   >
    //     <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    //       {activity?.participants?.map((member: any) => {
    //         return (
    //           <Typography
    //             key={member.name}
    //             variant="h6"
    //             sx={{ fontSize: '14px', mb: 1 }}
    //           >
    //             {member.name}&nbsp;
    //           </Typography>
    //         )
    //       })}
    //     </Box>
    //     <Box
    //       sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    //     >
    //       <PersonIcon sx={{ fontSize: '16px', color: 'gray', mb: 0.3 }} />
    //       {/* <Typography variant="h6" sx={{ fontSize: '14px', color: 'gray' }}>
    //         {accepted}/{capacity}
    //       </Typography> */}
    //     </Box>
    //   </Box>
    // </Box>
  )
}

export default MyActivityCard
