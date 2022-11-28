import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getActivity } from '../api/activities/requests'
import { PageWrapper } from '../components/page-wrapper'

const ActivityDetailsScreen = () => {
  // const { data } = useQuery(
  //   ['activity', activityId],
  //   () => getActivity(activityId),
  //   {
  //     enabled: !!activityId,
  //   }
  // )
  console.log('asasas')

  return <PageWrapper>activity-details</PageWrapper>
}

export default ActivityDetailsScreen
