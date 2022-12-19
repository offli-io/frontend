import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import MyActivityCard from '../../components/my-activity-card'
import { PageWrapper } from '../../components/page-wrapper'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getActivities,
  getActivity,
  getUsers,
} from '../../api/activities/requests'
import { IActivity, IPersonExtended } from '../../types/activities/activity.dto'
import { AuthenticationContext } from '../../assets/theme/authentication-provider'
import { DrawerContext } from '../../assets/theme/drawer-provider'
import ActivityActions from './components/activity-actions'
import { ActivityActionsTypeEnumDto } from '../../types/common/activity-actions-type-enum.dto'
import { useNavigate } from 'react-router-dom'
import { ApplicationLocations } from '../../types/common/applications-locations.dto'

const datetime = new Date()

const ActivitiesScreen = () => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)
  const { toggleDrawer } = React.useContext(DrawerContext)
  const navigate = useNavigate()

  const { data } = useQuery(
    ['user-info', userInfo?.username],
    () => getUsers(userInfo?.username)
    // {
    //   onSuccess: data =>
    //     data?.data?.activities && setActivityIds(data?.data?.activities),
    //   enabled: !!userInfo,
    // }
  )
  const [currentActivityId, setCurrentActivityId] = React.useState<
    string | undefined
  >()
  const [activityIds, setActivityIds] = React.useState<string[]>([])
  const [activites, setActivites] = React.useState<IActivity[]>([])

  const mut = useMutation(['presignup'], () =>
    axios.post('/registration/pre-signup', {
      email: 'fafa@gmail.com',
      password: 'Adamko123.',
    })
  )

  //[('213123', '43412')]
  // TODO to open drawer
  // React.useEffect(() => {
  //   toggleDrawer({
  //     open: true,
  //     content: <div>Ghetto maradona</div>,
  //   })
  // }, [])

  // React.useEffect(() => {
  //   const [first, ...rest] = activityIds
  //   if (first) {
  //     setCurrentActivityId(first)
  //     setActivityIds(rest)
  //   }
  // }, [activityIds])

  // React.useEffect(() => {
  //   userInfoQuery?.data?.data?.activities?.forEach(activity =>
  //     setCurrentActivityId(activity)
  //   )
  // }, [userInfoQuery?.data?.data?.activities])

  const handleActionClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto, activityId?: string) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(
            `${ApplicationLocations.ACTIVITY_ID}/${activityId}/members`
          )
        default:
          return console.log(action)
      }
    },
    []
  )

  const openActivityActions = React.useCallback(
    (activityId?: string) =>
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            onActionClick={handleActionClick}
            activityId={activityId}
          />
        ),
      }),
    [toggleDrawer]
  )

  React.useEffect(() => {
    //TODO is this fast enough isn't it flickering? Should I hide drawer before redirecting?
    return () =>
      toggleDrawer({
        open: false,
      })
  }, [toggleDrawer])

  return (
    <PageWrapper>
      <Typography
        variant="h6"
        sx={{
          width: '88%',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        My Actititties
      </Typography>

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {data?.data?.activities?.map(activity => {
          return (
            <MyActivityCard
              key={activity}
              activityId={activity}
              onLongPress={openActivityActions}
              onPress={openActivityActions}
            />
          )
        })}
      </Box>
    </PageWrapper>
  )
}

export default ActivitiesScreen
