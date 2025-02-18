import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material';
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto';

export interface IUseActivityMenuItemsProps {
  contrastText?: boolean;
}

export interface IActivityActionsObject {
  type: ActivityActionsTypeEnumDto;
  label: string;
  icon: React.ReactElement;
}

export const useActivityActionsDefinitions = ({
  contrastText
}: IUseActivityMenuItemsProps): IActivityActionsObject[] => {
  const { palette } = useTheme();
  return [
    {
      type: ActivityActionsTypeEnumDto.MORE_INFORMATION,
      label: 'More information',
      icon: (
        <MenuIcon
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.EDIT,
      label: 'Edit activity',
      icon: (
        <EditIcon
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.INVITE,
      label: 'Invite people',
      icon: (
        <EmailIcon
          color="primary"
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS,
      label: 'Activity members',
      icon: (
        <PeopleAltIcon
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.MAP,
      label: 'Show on map',
      icon: (
        <PublicIcon
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },

    {
      type: ActivityActionsTypeEnumDto.LEAVE,
      label: 'Leave',
      icon: (
        <LogoutIcon
          color="error"
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.DISMISS,
      label: 'Dismiss activity',
      icon: (
        <LogoutIcon
          color="error"
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    },
    {
      type: ActivityActionsTypeEnumDto.JOIN,
      label: 'Join the activity',
      icon: (
        <LoginIcon
          color="primary"
          sx={{
            color: palette?.text?.primary,
            ...(contrastText
              ? {
                  filter: 'invert(100%)'
                }
              : {})
          }}
        />
      )
    }
  ];
};
