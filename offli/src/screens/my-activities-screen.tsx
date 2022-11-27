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
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const datetime = new Date()

const ActivitiesScreen = () => {
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)

  const { data } = useQuery(
    ['user-info', userInfo?.username],
    () => getUsers(userInfo?.username)
    // {
    //   onSuccess: data =>
    //     data?.data?.activities && setActivityIds(data?.data?.activities),
    //   enabled: !!userInfo,
    // }
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
