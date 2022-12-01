import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'

export interface IActivityActionsObject {
  type: ActivityActionsTypeEnumDto
  label: string
  icon: React.ReactElement
}

export const ActivityActionsDefinitions: IActivityActionsObject[] = [
  {
    type: ActivityActionsTypeEnumDto.MORE_INFORMATION,
    label: 'More information',
    icon: <MenuIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS,
    label: 'Activity members',
    icon: <PeopleAltIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.INVITE,
    label: 'Invite',
    icon: <PersonAddAltIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.LEAVE,
    label: 'Leave',
    icon: <LogoutIcon color="error" />,
  },
]
