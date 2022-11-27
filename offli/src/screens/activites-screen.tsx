import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import MyActivityCard from '../components/my-activity-card'
import { PageWrapper } from '../components/page-wrapper'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getActivities } from '../api/activities/requests'
import { IActivity } from '../types/activities/activity.dto'

const datetime = new Date()

const ActivitiesScreen = () => {
  const activitiesQuery = useQuery(['activities'], props =>
    getActivities({ queryFunctionContext: props })
  )

  console.log(activitiesQuery?.data?.data?.activities)

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
        {activitiesQuery?.data?.data?.activities?.map((activity: IActivity) => {
          return <MyActivityCard key={activity.id} activity={activity} />
        })}
      </Box>
    </PageWrapper>
  )
}

export default ActivitiesScreen
