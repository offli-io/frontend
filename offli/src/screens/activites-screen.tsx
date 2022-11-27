import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import MyActivityCard from '../components/my-activity-card'
import { PageWrapper } from '../components/page-wrapper'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getActivities,
  getActivity,
  getUsers,
} from '../api/activities/requests'
import { IActivity, IPersonExtended } from '../types/activities/activity.dto'
import { AuthenticationContext } from '../assets/theme/authentication-provider'

const datetime = new Date()

const ActivitiesScreen = () => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)
  // const queryClient = useQueryClient()
  // const _activityIds = queryClient?.getQueryData<IPersonExtended>(['user-info'])
  // console.log(_activityIds)

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

  // React.useEffect(() => {
  //   if (data?.data?.activities) {
  //     setActivityIds(data?.data?.activities)
  //   }
  // }, [data])

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
          return <MyActivityCard key={activity} activityId={activity} />
        })}
      </Box>
    </PageWrapper>
  )
}

export default ActivitiesScreen
