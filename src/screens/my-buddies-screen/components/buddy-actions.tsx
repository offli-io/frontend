import { Box } from '@mui/material';
import React from 'react';
import MenuItem from '../../../components/menu-item';
import { IPerson } from '../../../types/activities/activity.dto';
import { BuddyActionTypeEnum } from '../../../types/common/buddy-actions-type-enum.dto';
import { useBuddyActions } from '../hooks/use-buddy-actions';

export interface IBuddyActionsProps {
  onBuddyActionClick?: (type?: BuddyActionTypeEnum, userId?: number) => void;
  buddy?: IPerson;
}

const BuddyActions: React.FC<IBuddyActionsProps> = ({ onBuddyActionClick, buddy }) => {
  const menuItems = useBuddyActions();

  return (
    <Box
      sx={{
        width: '100%'
      }}>
      {menuItems?.map((actionDefinition) => (
        <MenuItem
          label={actionDefinition?.label}
          type={actionDefinition?.type}
          icon={actionDefinition?.icon}
          key={`buddy_action${actionDefinition?.type}`}
          //temporary solution just add bolean if next icon should be displayed
          headerRight={<></>}
          onMenuItemClick={() => onBuddyActionClick?.(actionDefinition?.type, buddy?.id)}
        />
      ))}
    </Box>
  );
};

export default BuddyActions;
