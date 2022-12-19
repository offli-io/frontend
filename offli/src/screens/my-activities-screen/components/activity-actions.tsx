import React from 'react'
import { Box, Switch } from '@mui/material'
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto'
import { ActivityActionsDefinitions } from './activity-actions-definitions'
import MenuItem from '../../../components/menu-item'

export interface IActivityActionsProps {
  onActionClick?: (
    type?: ActivityActionsTypeEnumDto,
    activityId?: string
  ) => void
  activityId?: string
}

const ActivityActions: React.FC<IActivityActionsProps> = ({
  onActionClick,
  activityId,
}) => {
  return (
    <Box
      sx={{
        // display: 'flex',
        // flexDirection: 'column',
        width: '100%',
        // height: '100vh',
      }}
    >
      {ActivityActionsDefinitions?.map(actionDefinition => (
        <MenuItem
          label={actionDefinition?.label}
          type={actionDefinition?.type}
          icon={actionDefinition.icon}
          key={`activity_action_${actionDefinition?.type}`}
          //temporary solution just add bolean if next icon should be displayed
          headerRight={<></>}
          onMenuItemClick={() =>
            onActionClick?.(actionDefinition.type, activityId)
          }
        />
      ))}
    </Box>
  )
}

export default ActivityActions
