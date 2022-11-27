import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import MyActivityCard from '../components/my-activity-card'
import { IActivityProps } from '../types/common/types'
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

const dummyData: IActivityProps[] = [
  {
    id: 1,
    name: 'Go to cinema on Dune',
    price: 'starts at 10$',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 5,
    capacity: 10,
  },
  {
    id: 2,
    name: 'Run with Amelie',
    price: 'free',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 2,
    capacity: 2,
  },
  {
    id: 3,
    name: 'Sushi session',
    price: 'individual',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 5,
    capacity: 5,
  },
]

const ActivitiesScreen = () => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)
  const queryClient = useQueryClient()
  const _activityIds = queryClient?.getQueryData<IPersonExtended>(['user-info'])
  console.log(_activityIds)

  // const userInfoQuery = useQuery(
  //   ['user-info', userInfo?.username],
  //   () => getUsers(userInfo?.username),
  //   {
  //     onSuccess: data =>
  //       data?.data?.activities && setActivityIds(data?.data?.activities),
  //   }
  // )
  const [currentActivityId, setCurrentActivityId] = React.useState<
    string | undefined
  >()
  const [activityIds, setActivityIds] = React.useState<string[]>(
    _activityIds?.activities ?? []
  )
  const [activites, setActivites] = React.useState<IActivity[]>([])
  const activitiesQuery = useQuery(
    ['activities', currentActivityId],
    props => getActivity(currentActivityId),
    {
      onSuccess: data => {
        setActivites(activites => [...activites, data?.data])
      },
      enabled: !!currentActivityId,
    }
  )
  console.log(activitiesQuery?.data?.data)

  const mut = useMutation(['presignup'], () =>
    axios.post('/registration/pre-signup', {
      email: 'fafa@gmail.com',
      password: 'Adamko123.',
    })
  )

  //[('213123', '43412')]

  React.useEffect(() => {
    const [first, ...rest] = activityIds
    if (first) {
      setCurrentActivityId(first)
      setActivityIds(rest)
    }
  }, [activityIds])

  // React.useEffect(() => {
  //   userInfoQuery?.data?.data?.activities?.forEach(activity =>
  //     setCurrentActivityId(activity)
  //   )
  // }, [userInfoQuery?.data?.data?.activities])

  return (
    <PageWrapper>
      <Button onClick={() => mut.mutate()}>Fetch</Button>

      <Typography
        variant="h6"
        sx={{
          width: '88%',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'gray',
          mt: 1,
        }}
      >
        Today
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
        {dummyData.map(
          ({
            id,
            name,
            price,
            location,
            datetime,
            members,
            accepted,
            capacity,
          }) => {
            return (
              <MyActivityCard
                // id={id}
                key={id}
                name={name}
                price={price}
                location={location}
                datetime={datetime}
                members={members}
                accepted={accepted}
                capacity={capacity}
              />
            )
          }
        )}
      </Box>
      <></>
      {/* TODO dat dopice, PageWrapper ocakava children[] ale dostava len 1 child*/}
    </PageWrapper>
  )
}

export default ActivitiesScreen
