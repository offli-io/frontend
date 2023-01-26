import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PublicIcon from "@mui/icons-material/Public";
import EditIcon from "@mui/icons-material/Edit";

export interface IActivityActionsObject {
  type: ActivityActionsTypeEnumDto;
  label: string;
  icon: React.ReactElement;
}

export const ActivityActionsDefinitions: IActivityActionsObject[] = [
  {
    type: ActivityActionsTypeEnumDto.MORE_INFORMATION,
    label: "More information",
    icon: <MenuIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.EDIT,
    label: "Edit activity",
    icon: <EditIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS,
    label: "Activity members",
    icon: <PeopleAltIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.MAP,
    label: "Show on map",
    icon: <PublicIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.INVITE,
    label: "Invite",
    icon: <PersonAddAltIcon />,
  },
  {
    type: ActivityActionsTypeEnumDto.LEAVE,
    label: "Leave",
    icon: <LogoutIcon color="error" />,
  },
  {
    type: ActivityActionsTypeEnumDto.DISMISS,
    label: "Dismiss activity",
    icon: <LogoutIcon color="error" />,
  },
  {
    type: ActivityActionsTypeEnumDto.JOIN,
    label: "Join the activity",
    icon: <LoginIcon color="primary" />,
  },
];
