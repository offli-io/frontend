import CollectionsIcon from '@mui/icons-material/Collections';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box } from '@mui/material';
import React from 'react';
import MenuItem from '../../../components/menu-item';
import { IDrawerActionsType } from '../../../types/common/drawer-actions-type.dto';

export interface IProfilePhotoActionsProps {
  onActionClick?: (type?: ProfilePhotoActionsEnum) => void;
}

export enum ProfilePhotoActionsEnum {
  TAKE_PICTURE = 'TAKE_PICTURE',
  SELECT_FROM_DEVICE = 'SELECT_FROM_DEVICE',
  REMOVE_PICTURE = 'REMOVE_PICTURE'
}

const ProfilePhotoActionDefinitions: IDrawerActionsType<ProfilePhotoActionsEnum>[] = [
  {
    label: 'Select from your device',
    type: ProfilePhotoActionsEnum.SELECT_FROM_DEVICE,
    icon: <CollectionsIcon color="primary" />
  },
  {
    label: 'Remove picture',
    type: ProfilePhotoActionsEnum.REMOVE_PICTURE,
    icon: <RemoveCircleOutlineIcon color="primary" />
  }
];

const ProfilePhotoActions: React.FC<IProfilePhotoActionsProps> = ({ onActionClick }) => {
  return (
    <Box
      sx={{
        width: '100%'
      }}>
      {ProfilePhotoActionDefinitions.map((actionDefinition) => (
        <MenuItem
          label={actionDefinition?.label}
          type={actionDefinition?.type}
          icon={actionDefinition?.icon}
          key={`activity_action_${actionDefinition?.type}`}
          //temporary solution just add bolean if next icon should be displayed
          headerRight={<></>}
          onMenuItemClick={() => onActionClick?.(actionDefinition?.type)}
        />
      ))}
    </Box>
  );
};

export default ProfilePhotoActions;
