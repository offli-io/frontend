import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { SettingsTypeEnumDto } from '../../types/common/settings-type-enum.dto';

export interface ISettingsItemsObject {
  type: SettingsTypeEnumDto;
  label: string;
  icon: React.ReactElement;
}

export const SettingsItemsObject: ISettingsItemsObject[] = [
  {
    type: SettingsTypeEnumDto.ACCOUNT,
    label: 'Account',
    icon: <AccountCircleIcon color="primary" />
  },
  {
    type: SettingsTypeEnumDto.TERM_PRIVACY,
    label: 'Term and privacy policy',
    icon: <VerifiedUserIcon color="primary" />
  },
  {
    type: SettingsTypeEnumDto.HELP_SUPPORT,
    label: 'Help and support',
    icon: <HelpIcon color="primary" />
  }
];
