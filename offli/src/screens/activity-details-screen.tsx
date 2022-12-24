import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getActivity } from '../api/activities/requests'
import ActivityDetailsCard from '../components/activity-details-card'
import BackHeader from '../components/back-header'
import { PageWrapper } from '../components/page-wrapper'
import { ICustomizedLocationStateDto } from '../types/common/customized-location-state.dto'

interface IActivityDetailsScreenProps {
  type: 'detail' | 'request'
}

const ActivityDetailsScreen: React.FC<IActivityDetailsScreenProps> = ({
  type,
}) => {
  const { id } = useParams()
  const location = useLocation()
  const from = (location?.state as ICustomizedLocationStateDto)?.from

  const { data } = useQuery(['activity', id], () => getActivity(id), {
    enabled: !!id,
  })
  const activity = data?.data?.activity

  console.log(activity)

  return (
    <>
      {type === 'request' && <BackHeader title="Activity invite" to={from} />}
      <PageWrapper>
        {activity ? <ActivityDetailsCard activity={activity} /> : null}
      </PageWrapper>
    </>
  )
}

export default ActivityDetailsScreen
