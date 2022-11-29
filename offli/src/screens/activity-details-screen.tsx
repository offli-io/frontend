import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getActivity } from '../api/activities/requests'
import ActivityDetailsCard from '../components/activity-details-card'
import { PageWrapper } from '../components/page-wrapper'

const ActivityDetailsScreen = () => {
  const { id } = useParams()

  const { data } = useQuery(['activity', id], () => getActivity(id), {
    enabled: !!id,
  })
  const activity = data?.data?.activity

  console.log(activity)

  return (
    <PageWrapper>
      {activity ? <ActivityDetailsCard activity={activity} /> : null}
    </PageWrapper>
  )
}

export default ActivityDetailsScreen
