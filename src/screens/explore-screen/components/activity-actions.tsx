import { Box, Divider, Typography } from '@mui/material';
import { isAfter } from 'date-fns';
import React from 'react';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import MenuItem from '../../../components/menu-item';
import { ActivitiyParticipantStatusEnum } from '../../../types/activities/activity-participant-status-enum.dto';
import { ActivityVisibilityEnum } from '../../../types/activities/activity-visibility-enum.dto';
import { IActivity } from '../../../types/activities/activity.dto';
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto';
import { useActivityMenuItems } from '../hooks/use-activity-menu-items';

export interface IActivityActionsProps {
  onActionClick?: (type?: ActivityActionsTypeEnumDto, activityId?: number) => void;
  activity?: IActivity;
  contrastText?: boolean;
}

const ActivityActions: React.FC<IActivityActionsProps> = ({
  onActionClick,
  activity,
  contrastText
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);

  const isCreator = activity?.creator?.id === userInfo?.id;
  const isParticipant = React.useMemo(
    () => activity?.participant_status === ActivitiyParticipantStatusEnum.CONFIRMED,
    [activity]
  );
  const isPastActivity =
    !!activity?.datetime_until && isAfter(new Date(), new Date(activity.datetime_until));

  const menuItems = useActivityMenuItems({
    isCreator,
    isParticipant,
    isPrivate: activity?.visibility === ActivityVisibilityEnum.private,
    contrastText,
    isPastActivity
  });

  if (!activity) {
    return (
      <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
        Currently there are no actions to display
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: '100%'
      }}>
      {menuItems?.map((actionDefinition, index) => (
        <React.Fragment key={actionDefinition?.type}>
          <MenuItem
            label={actionDefinition?.label}
            type={actionDefinition?.type}
            icon={actionDefinition?.icon}
            // key={`activity_action_${index}_${actionDefinition?.type}`}
            //temporary solution just add bolean if next icon should be displayed
            headerRight={<></>}
            onMenuItemClick={() => onActionClick?.(actionDefinition?.type, activity?.id)}
            contrastText={contrastText}
          />
          {index !== menuItems?.length - 1 ? (
            <Divider sx={{ bgcolor: ({ palette }) => palette?.inactive?.main }} />
          ) : null}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ActivityActions;
