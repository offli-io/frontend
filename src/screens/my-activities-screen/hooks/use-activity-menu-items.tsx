import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import { useActivityActionsDefinitions } from "./use-activity-action-definitions";

export interface IUseActivityMenuItemsProps {
  isCreator?: boolean;
  isParticipant?: boolean;
  contrastText?: boolean;
}

const CORE_ACTIONS = [
  ActivityActionsTypeEnumDto.MORE_INFORMATION,
  ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS,
  ActivityActionsTypeEnumDto.MAP,
];

export const useActivityMenuItems = ({
  isCreator,
  isParticipant,
  contrastText,
}: IUseActivityMenuItemsProps) => {
  const actionDefinitions = useActivityActionsDefinitions({ contrastText });
  return actionDefinitions.filter((menuItem) => {
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
