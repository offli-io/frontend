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

const datetime = new Date()

const ActivitiesScreen = () => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)
  const { toggleDrawer } = React.useContext(DrawerContext)

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
    (action?: ActivityActionsTypeEnumDto) => console.log(action),
    []
  )

  const openActivityActions = React.useCallback(
    () =>
      toggleDrawer({
        open: true,
        content: <ActivityActions onActionClick={handleActionClick} />,
      }),
    [toggleDrawer]
  )

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
        My Actititties{data?.data?.name}
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
            />
          )
        })}
      </Box>
    </PageWrapper>
  )
}

export default ActivitiesScreen
