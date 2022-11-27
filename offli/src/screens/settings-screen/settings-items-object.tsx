import { SettingsTypeEnumDto } from '../../types/common/settings-type-enum.dto'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import HelpIcon from '@mui/icons-material/Help'

export interface ISettingsItemsObject {
  type: SettingsTypeEnumDto
  label: string
  icon: React.ReactElement
}

export const SettingsItemsObject: ISettingsItemsObject[] = [
  {
    type: SettingsTypeEnumDto.ACCOUNT,
    label: 'Account',
    icon: <AccountCircleIcon color="primary" />,
  },
  {
    type: SettingsTypeEnumDto.NOTIFICATIONS,
    label: 'Notifications',
    icon: <NotificationsIcon color="primary" />,
  },
  {
    type: SettingsTypeEnumDto.TERM_PRIVACY,
    label: 'Term and privacy policy',
    icon: <VerifiedUserIcon color="primary" />,
  },
  {
    type: SettingsTypeEnumDto.HELP_SUPPORT,
    label: 'Help and support',
    icon: <HelpIcon color="primary" />,
  },
  {
    type: SettingsTypeEnumDto.ABOUT,
    label: 'Help and support',
    icon: <HelpIcon color="primary" />,
  },
  {
    type: SettingsTypeEnumDto.HELP_SUPPORT,
    label: 'Help and support',
    icon: <HelpIcon color="primary" />,
  },
  //   {
  //     type: SettingsTypeEnumDto.DARK_THEME,
  //     icon: VerifiedUserIcon,
  //   },
]
