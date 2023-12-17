import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { ProfilePhotoActionsEnum } from '../screens/edit-profile-screen/components/profile-photo-actions';
import { ActivityActionsTypeEnumDto } from '../types/common/activity-actions-type-enum.dto';
import { BuddyActionTypeEnum } from '../types/common/buddy-actions-type-enum.dto';
import { SettingsTypeEnumDto } from '../types/common/settings-type-enum.dto';

interface ILabeledDividerProps {
  label?: string;
  onMenuItemClick?: (
    type?:
      | SettingsTypeEnumDto
      | ActivityActionsTypeEnumDto
      | BuddyActionTypeEnum
      | ProfilePhotoActionsEnum
  ) => void;
  type?:
    | SettingsTypeEnumDto
    | ActivityActionsTypeEnumDto
    | BuddyActionTypeEnum
    | ProfilePhotoActionsEnum;
  icon?: React.ReactElement;
  headerRight?: React.ReactElement;
  contrastText?: boolean;
  disabled?: boolean;
}

const MenuItem: React.FC<ILabeledDividerProps> = ({
  label,
  type,
  onMenuItemClick,
  icon,
  headerRight,
  contrastText,
  disabled,
  ...rest
}) => {
  //TODO refactor this to Button component
  return (
    <Box
      onClick={() => !disabled && onMenuItemClick?.(type)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.5,
        textTransform: 'none',
        width: '100%',
        boxSizing: 'border-box'
      }}
      {...rest}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography
          sx={{
            ml: 2,
            color: ({ palette }) => palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}>
          {label}
        </Typography>
      </Box>
      {headerRight ?? (
        <NavigateNextIcon
          sx={{
            color: ({ palette }) => palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )}
    </Box>
  );
};
export default MenuItem;
