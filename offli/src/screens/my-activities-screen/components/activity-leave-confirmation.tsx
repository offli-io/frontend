import React from 'react'
import { Box, Switch, Typography } from '@mui/material'
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto'
import { ActivityActionsDefinitions } from './activity-actions-definitions'
import MenuItem from '../../../components/menu-item'
import { IActivity } from '../../../types/activities/activity.dto'
import OffliButton from '../../../components/offli-button'

export interface IActivityActionsProps {
  onLeaveConfirm?: (activityId?: string) => void
  onLeaveCancel?: (activityId?: string) => void
  activity?: IActivity
}

const ActivityLeaveConfirmation: React.FC<IActivityActionsProps> = ({
  onLeaveConfirm,
  onLeaveCancel,
  activity,
}) => {
  //TODO if no activity display nothing
  return (
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
        style={{ height: 70, width: 70, borderRadius: 50 }}
        src={activity?.title_picture}
      />
      <Typography
        sx={{ my: 2 }}
      >{`Do you really want to leave ${activity?.title}`}</Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          // mt: 4,
        }}
      >
        <OffliButton
          sx={{ width: '50%', fontSize: 16 }}
          variant="outlined"
          onClick={() => onLeaveCancel?.(activity?.id)}
        >
          Cancel
        </OffliButton>
        <OffliButton
          sx={{ width: '50%', fontSize: 16 }}
          onClick={() => onLeaveConfirm?.(activity?.id)}
        >
          Leave
        </OffliButton>
      </Box>
    </Box>
  )
}

export default ActivityLeaveConfirmation
