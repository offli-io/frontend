import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PublicIcon from "@mui/icons-material/Public";
import { ActivityActionsDefinitions } from "../components/activity-actions-definitions";

export interface IUseActivityMenuItemsProps {
  isCreator?: boolean;
  isParticipant?: boolean;
}

const CORE_ACTIONS = [
  ActivityActionsTypeEnumDto.MORE_INFORMATION,
  ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS,
  ActivityActionsTypeEnumDto.MAP,
];

export const useActivityMenuItems = ({
  isCreator,
  isParticipant,
}: IUseActivityMenuItemsProps) => {
  return ActivityActionsDefinitions?.filter((menuItem) => {
    if (CORE_ACTIONS.includes(menuItem?.type)) {
      return menuItem;
    }
    if (menuItem?.type === ActivityActionsTypeEnumDto.DISMISS && isCreator) {
      return menuItem;
    }
    if (
      menuItem?.type === ActivityActionsTypeEnumDto.LEAVE &&
      isParticipant &&
      !isCreator
    ) {
      return menuItem;
    }
    if (
      menuItem?.type === ActivityActionsTypeEnumDto.INVITE &&
      (isParticipant || isCreator)
    ) {
      return menuItem;
    }
    if (menuItem?.type === ActivityActionsTypeEnumDto.EDIT && isCreator) {
      return menuItem;
    }
    if (
      menuItem?.type === ActivityActionsTypeEnumDto.JOIN &&
      !isCreator &&
      !isParticipant
    ) {
      return menuItem;
    }
    return undefined;
  });
};
