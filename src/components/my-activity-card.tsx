import React from 'react'
import { Box, Typography } from '@mui/material'
import { IActivity } from '../types/activities/activity.dto'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import useLongPress from '../hooks/use-long-press'
import TransparentChip from './transparent-chip'
import { ActivityVisibilityEnum } from '../types/activities/activity-visibility-enum.dto'

interface IProps {
  activity?: IActivity
  onLongPress: (activityId: string) => void
  onPress: (activityId?: string) => void
}

const MyActivityCard: React.FC<IProps> = ({
  activity,
  onLongPress,
  onPress,
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress()

  return (
    <Box
      sx={{
        width: '99%',
        height: '20rem',
        marginTop: '2%',
        marginBottom: '5%',
      }}
      onClick={() => onPress(activity?.id)}
      // {...handlers}
      // onTouchStart={() => {
      //   const timer = setTimeout(() => onLongPress(), 500)
      // }}
      // onTouchEnd={() => clearTimeout(timer)}
    >
      <Box
        sx={{
          width: '100%',
          height: '80%',
          // backgroundImage: `url(${require('../assets/img/dune_small.png')})`,
          backgroundImage: `url(${activity?.title_picture})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          borderRadius: '12px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.8,
          }}
        >
          {activity?.limit ? (
            <TransparentChip
              text={`${activity?.participants?.length}/${activity?.limit}`}
              Icon={<PeopleAltIcon sx={{ fontSize: '22px' }} />}
            />
          ) : (
            <TransparentChip
              text={`${activity?.participants?.length}`}
              Icon={<PeopleAltIcon sx={{ fontSize: '22px' }} />}
            />
          )}

          <TransparentChip
            text={activity?.price}
            Icon={<AttachMoneyIcon sx={{ fontSize: '22px' }} />}
          />
          {activity?.visibility == ActivityVisibilityEnum.public ? (
            <TransparentChip
              text={activity?.visibility}
              Icon={<LockOpenIcon sx={{ fontSize: '22px' }} />}
            />
          ) : (
            <TransparentChip
              text={activity?.visibility}
              Icon={<LockIcon sx={{ fontSize: '22px' }} />}
            />
          )}
        </Box>
      </Box>
      <Box sx={{ ml: 1, mt: 1 }}>
        <Typography
          variant="h4"
          sx={{
            textTransform: 'uppercase',
            // fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          {activity?.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            lineHeight: 1.3,
          }}
        >
          {/* {activity?.datetime} ???? */}
          September 15th 19:00
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            lineHeight: 1.2,
          }}
        >
          {activity?.location?.name}
        </Typography>
      </Box>
    </Box>

    // <Box
    //   sx={{
    //     width: '99%',
    //     height: '37%',
    //     marginTop: '2%',
    //     marginBottom: '2%',
    //     borderRadius: '12px',
    // backgroundImage: `url(${require('../assets/img/dune.webp')})`,
    // backgroundPosition: 'center',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    // display: 'flex',
    // alignItems: 'flex-end',
    //     color: 'white',
    //   }}
    // onClick={() => onPress(activity?.id)}
    // {...handlers}
    // onTouchStart={() => {
    //   const timer = setTimeout(() => onLongPress(), 500)
    // }}
    // onTouchEnd={() => clearTimeout(timer)}
    // >
    // <Box
    //   sx={{
    //     height: '25%',
    //     width: '100%',
    //     backgroundColor: 'rgba(0,0,0,.8)',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     padding: '3% 3% 2% 3%',
    //     borderBottomLeftRadius: '12px',
    // borderBottomRightRadius: '12px',
    // backdropFilter: 'blur(2px)',
    //     // position: 'absolute',
    //     // bottom: 0,
    //   }}
    // >
    //     <Box sx={{ height: '100%' }}>
    // <Typography
    //   variant="h4"
    //   sx={{
    //     textTransform: 'uppercase',
    //     fontWeight: 400,
    //     lineHeight: 0.6,
    //   }}
    // >
    //   {activity?.title}
    // </Typography>
    //       {activity?.location?.name ? (
    //         <Typography
    //           variant="subtitle2"
    //           sx={{ fontweight: 200, fontSize: 11, lineHeight: 2 }}
    //         >
    //           {activity?.location?.name}
    //         </Typography>
    //       ) : (
    //         <Typography
    //           variant="subtitle1"
    //           sx={{ fontSize: 11, visibility: 'hidden', lineHeight: 2 }}
    //         >
    //           pica
    //         </Typography>
    //       )}
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'row',
    //           alignItems: 'center',
    //           justifyContent: 'flex-start',
    //           mt: -0.5,
    //         }}
    //       >
    //         <Box>
    //           <LockIcon sx={{ fontSize: '14px' }} />
    //         </Box>
    //         <Box
    //           sx={{
    //             display: 'flex',
    //             flexDirection: 'row',
    //             alignItems: 'flex-end',
    //           }}
    //         >
    //           <PeopleAltIcon sx={{ fontSize: '16px', ml: 1.5, mr: 0.5 }} />
    //           {activity?.limit ? (
    //             <Typography
    //               variant="subtitle2"
    //               sx={{ lineHeight: 1.1, fontWeight: 200 }}
    //             >
    //               {activity?.participants?.length}/{activity?.limit}
    //             </Typography>
    //           ) : (
    //             <Typography variant="subtitle2">
    //               {activity?.participants?.length} 0
    //             </Typography>
    //           )}
    //         </Box>
    //       </Box>
    //     </Box>
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //       }}
    //     >
    //       <Box>
    //         <Typography variant="h6" sx={{ lineHeight: 1, fontSize: '24px' }}>
    //           20
    //         </Typography>
    //       </Box>
    //       <Box>
    //         <Typography
    //           variant="subtitle2"
    //           sx={{
    //             lineHeight: 1,
    //             fontSize: '12px',
    //             fontWeight: 'lighter',
    //             letterSpacing: 0,
    //           }}
    //         >
    //           September
    //         </Typography>
    //       </Box>
    //       <Box>
    //         <Typography
    //           variant="subtitle2"
    //           sx={{ lineHeight: 1.1, fontSize: '20px', fontWeight: 200 }}
    //         >
    //           17:00
    //         </Typography>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Box>
  )
}

export default MyActivityCard
