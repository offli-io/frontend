import * as React from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { Box, Paper, SxProps } from '@mui/material'
import { Link } from 'react-router-dom'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import OfflineBoltOutlinedIcon from '@mui/icons-material/OfflineBoltOutlined'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AddCircleIcon from '@mui/icons-material/AddCircleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import OffliButton from './offli-button'
import { acceptBuddyInvitation } from '../api/users/requests'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { HEADER_HEIGHT } from '../utils/common-constants'

interface IBottomNavigatorProps {
  sx?: SxProps
}

const BottomNavigator: React.FC<IBottomNavigatorProps> = ({ sx }) => {
  const [value, setValue] = React.useState<ApplicationLocations>(
    ApplicationLocations.ACTIVITIES
  )
  const [isActionRequired, setIsActionRequired] = React.useState(false)
  const { userInfo } = React.useContext(AuthenticationContext)
  const location = useLocation()
  const paramsArray = location?.pathname.split('/')
  const id = paramsArray[paramsArray.length - 1]
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const isBuddyRequest = location?.pathname?.includes('/profile/request')
  const isActivityRequest = location?.pathname?.includes('/activity/request')

  React.useEffect(() => {
    setValue(location?.pathname as ApplicationLocations)
    if (location?.pathname.includes('/request')) {
      setIsActionRequired(true)
    } else {
      setIsActionRequired(false)
    }
  }, [location])

  const { mutate: sendAcceptBuddyRequest } = useMutation(
    ['accept-buddy-request'],
    () => acceptBuddyInvitation(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        queryClient.invalidateQueries(['notifications'])
        enqueueSnackbar('User was successfully confirmed as your buddy', {
          variant: 'success',
        })
        navigate(ApplicationLocations.NOTIFICATIONS)
      },
      onError: () => {
        enqueueSnackbar('Failed to accept buddy request', {
          variant: 'error',
        })
      },
    }
  )

  const acceptInvitation = React.useCallback(() => {
    if (isBuddyRequest) {
      return sendAcceptBuddyRequest()
    }
    if (isActivityRequest) {
      return
    }
    return
  }, [isBuddyRequest, isActivityRequest])

  const declineInvitation = React.useCallback(() => {
    if (isBuddyRequest) {
      return sendAcceptBuddyRequest()
    }
    if (isActivityRequest) {
      return
    }
    return
  }, [isBuddyRequest, isActivityRequest])

  return (
    <Paper
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: HEADER_HEIGHT,
        ...(isActionRequired && {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
      }}
      // sx={sx}
      elevation={3}
    >
      {isActionRequired ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <OffliButton
            sx={{ width: '30%', fontSize: 16 }}
            variant="outlined"
            onClick={declineInvitation}
          >
            Reject
          </OffliButton>
          <OffliButton
            sx={{ width: '50%', fontSize: 16 }}
            onClick={acceptInvitation}
          >
            Accept
          </OffliButton>
        </Box>
      ) : (
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
          sx={{
            '& .Mui-selected': {
              fontSize: '12px !important',
            },
          }}
        >
          <BottomNavigationAction
            label="My Activities"
            // icon={location === BottomNavigationPaths.MY_ACTIVITES
            //   ? (<OfflineBoltIcon sx={{ transform: 'rotate(30deg)' }})
            //   : (<OfflineBoltOutlinedIcon sx={{ transform: 'rotate(30deg)' }})/>}
            icon={
              <OfflineBoltOutlinedIcon sx={{ transform: 'rotate(30deg)' }} />
            }
            component={Link}
            value={ApplicationLocations.ACTIVITIES}
            to={ApplicationLocations.ACTIVITIES}
          />
          <BottomNavigationAction
            label="Create"
            icon={<AddCircleOutlineIcon />}
            component={Link}
            value={ApplicationLocations.CREATE}
            to={ApplicationLocations.CREATE}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<AccountCircleOutlinedIcon />}
            component={Link}
            value={ApplicationLocations.PROFILE}
            to={ApplicationLocations.PROFILE}
          />
        </BottomNavigation>
      )}
    </Paper>
  )
}

export default BottomNavigator
