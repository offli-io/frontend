import { BuddyActionTypeEnum } from "../../types/common/buddy-actions-type-enum.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PublicIcon from "@mui/icons-material/Public";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export interface IBuddyActionObject {
  type: BuddyActionTypeEnum;
  label: string;
  icon: React.ReactElement;
}

export const BuddiesActionDefinitions: IBuddyActionObject[] = [
  {
    type: BuddyActionTypeEnum.PROFILE,
    label: "Show profile",
    icon: <AccountCircleOutlinedIcon />,
  },
  {
    type: BuddyActionTypeEnum.REMOVE,
    label: "Remove buddy",
    icon: <PersonRemoveIcon color="error" />,
  },
];
