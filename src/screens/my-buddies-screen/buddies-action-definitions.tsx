import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BuddyActionTypeEnum } from '../../types/common/buddy-actions-type-enum.dto';

export interface IBuddyActionObject {
  type: BuddyActionTypeEnum;
  label: string;
  icon: React.ReactElement;
}

export const BuddiesActionDefinitions: IBuddyActionObject[] = [
  {
    type: BuddyActionTypeEnum.PROFILE,
    label: 'Show profile',
    icon: <AccountCircleOutlinedIcon />
  },
  {
    type: BuddyActionTypeEnum.REMOVE,
    label: 'Remove buddy',
    icon: <PersonRemoveIcon color="error" />
  }
];
