import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getActivity } from '../api/activities/requests'
import ActivityDetailsCard from '../components/activity-details-card'
import BackHeader from '../components/back-header'
import { PageWrapper } from '../components/page-wrapper'

interface IActivityDetailsScreenProps {
  type: 'detail' | 'request'
}

const ActivityDetailsScreen: React.FC<IActivityDetailsScreenProps> = ({
  type,
}) => {
  const { id } = useParams()

  const { data } = useQuery(['activity', id], () => getActivity(id), {
    enabled: !!id,
  })
  const activity = data?.data?.activity

  console.log(activity)

  return (
    <>
      {type === 'request' && <BackHeader title="Activity invite" to={'idk'} />}
      <PageWrapper>
        {activity ? <ActivityDetailsCard activity={activity} /> : null}
      </PageWrapper>
    </>
  )
}

export default ActivityDetailsScreen
