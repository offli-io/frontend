import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { DrawerContext } from '../../../components/context/providers/drawer-provider';
import { ActivitiyParticipantStatusEnum } from '../../../types/activities/activity-participant-status-enum.dto';
import { ActivityMembersActionTypeDto } from '../../../types/common/activity-members-action-type.dto';
import { BuddyActionDrawerContent } from './buddy-action-drawer-content';

interface IBuddyActionContentProps {
  userId?: number;
  onActionClick?: (actionType: ActivityMembersActionTypeDto, userId?: number) => void;
  userStatus?: ActivitiyParticipantStatusEnum;
}

export const BuddyActionContent: React.FC<IBuddyActionContentProps> = ({
  userId,
  userStatus,
  onActionClick
}) => {
  const { toggleDrawer } = React.useContext(DrawerContext);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    toggleDrawer({
      open: true,
      content: (
        <BuddyActionDrawerContent
          onActionClick={onActionClick}
          userStatus={userStatus}
          userId={userId}
        />
      )
    });
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
    </Box>
  );
};
