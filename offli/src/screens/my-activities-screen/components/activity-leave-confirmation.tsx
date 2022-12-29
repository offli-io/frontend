import React from 'react'
import { Box, CircularProgress, Switch, Typography } from '@mui/material'
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto'
import { ActivityActionsDefinitions } from './activity-actions-definitions'
import MenuItem from '../../../components/menu-item'
import { IActivity } from '../../../types/activities/activity.dto'
import OffliButton from '../../../components/offli-button'
import { useActivities } from '../../../hooks/use-activities'
import { IActivityRestDto } from '../../../types/activities/activity-rest.dto'

export interface IActivityActionsProps {
  onLeaveConfirm?: (activityId?: string) => void
  onLeaveCancel?: (activityId?: string) => void
  activityId?: string
}

const ActivityLeaveConfirmation: React.FC<IActivityActionsProps> = ({
  onLeaveConfirm,
  onLeaveCancel,
  activityId,
}) => {
  //TODO if no activity display nothing

  const { data, isLoading } = useActivities<IActivityRestDto>({
    id: activityId,
  })
  return isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress color="primary" />
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" sx={{ my: 2 }}>
        Leaving the group
      </Typography>

      <img
        style={{
          height: 70,
          width: 70,
          borderRadius: 35,
          boxShadow: '2px 3px 4px #ccc',
        }}
        src={data?.data?.activity?.title_picture}
      />
      <Box display="flex" sx={{ my: 2 }}>
        <Typography>Do you really want to leave</Typography>
        <Typography sx={{ fontWeight: 'bold', ml: 1 }}>
          {data?.data?.activity?.title}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          // mt: 4,
        }}
      >
        <OffliButton
          sx={{ width: '40%', fontSize: 16 }}
          variant="outlined"
          onClick={() => onLeaveCancel?.(data?.data?.activity?.id)}
        >
          Cancel
        </OffliButton>
        <OffliButton
          sx={{ width: '40%', fontSize: 16 }}
          onClick={() => onLeaveConfirm?.(data?.data?.activity?.id)}
        >
          Leave
        </OffliButton>
      </Box>
    </Box>
  )
}

export default ActivityLeaveConfirmation
