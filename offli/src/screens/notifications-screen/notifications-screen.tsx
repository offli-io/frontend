import React from 'react'
import { Box } from '@mui/material'
import BackHeader from '../../components/back-header'
import { AuthenticationContext } from '../../assets/theme/authentication-provider'
import { setAuthToken } from '../../utils/token.util'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApplicationLocations } from '../../types/common/applications-locations.dto'
import { useNotifications } from '../../hooks/use-notifications'
import NotificationRequest from '../../components/notification-request'
import { INotificationDto } from '../../types/notifications/notification.dto'
import { NotificationTypeEnum } from '../../types/notifications/notification-type-enum'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markNotificationAsSeen } from '../../api/notifications/requests'
import { useSnackbar } from 'notistack'

export interface ICustomizedLocationState {
  from?: string
}

const NotificationsScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location?.state as ICustomizedLocationState
  const { from } = state
  const { data } = useNotifications(userInfo?.id)
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const { mutate: sendMarkNotification } = useMutation(
    ['mark-notification'],
    (notification: INotificationDto) =>
      markNotificationAsSeen({ ...notification, seen: true }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['notifications'])
        navigateBasedOnType(variables?.type)
      },
      onError: () => {
        enqueueSnackbar('Failed to load notification detail', {
          variant: 'error',
        })
      },
    }
  )

  const navigateBasedOnType = React.useCallback(
    (type?: NotificationTypeEnum) => {
      if (type === NotificationTypeEnum.ACTIVITY_INV) {
        return navigate(
          `${ApplicationLocations.ACTIVITIES}/tumusibytidactivity/request`
        )
      }
      if (type === NotificationTypeEnum.BUDDY_INV) {
        return navigate(`${ApplicationLocations.PROFILE}/request`)
      }
      return
    },
    [navigate]
  )

  const handleNotificationClick = React.useCallback(
    (notification: INotificationDto) => {
      return notification?.seen
        ? navigateBasedOnType(notification?.type)
        : sendMarkNotification(notification)
    },
    []
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}
    >
      <BackHeader title="Notifications" sx={{ mb: 2 }} to={from} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          px: 2,
          boxSizing: 'border-box',
        }}
      >
        {data?.data?.notifications?.map(notification => (
          <NotificationRequest
            notification={notification}
            onClick={handleNotificationClick}
          />
        ))}
      </Box>
    </Box>
  )
}

export default NotificationsScreen
