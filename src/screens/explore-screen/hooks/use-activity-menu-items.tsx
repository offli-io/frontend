import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto';
import { ApplicationLocations } from '../../../types/common/applications-locations.dto';
import { useActivityActionsDefinitions } from './use-activity-action-definitions';

export interface IUseActivityMenuItemsProps {
  isCreator?: boolean;
  isParticipant?: boolean;
  isPrivate?: boolean;
  contrastText?: boolean;
  isPastActivity?: boolean;
}

const CORE_ACTIONS = [ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS, ActivityActionsTypeEnumDto.MAP];

export const useActivityMenuItems = ({
  isCreator,
  isParticipant,
  isPrivate,
  contrastText,
  isPastActivity
}: IUseActivityMenuItemsProps) => {
  const actionDefinitions = useActivityActionsDefinitions({ contrastText });
  // can't use location.pathname because Drawer is outside <Router> scope
  const isActivityDetail = window.location?.href?.includes(ApplicationLocations.ACTIVITY_DETAIL);
  return actionDefinitions.filter((menuItem) => {
    if (CORE_ACTIONS.includes(menuItem?.type)) {
      return menuItem;
    }
    // do not return more information on detail card of the activity
    if (!isActivityDetail && menuItem?.type === ActivityActionsTypeEnumDto.MORE_INFORMATION) {
      return menuItem;
    }
    if (!isPastActivity) {
      if (menuItem?.type === ActivityActionsTypeEnumDto.DISMISS && isCreator) {
        return menuItem;
      }
      if (menuItem?.type === ActivityActionsTypeEnumDto.LEAVE && isParticipant && !isCreator) {
        return menuItem;
      }
      if (menuItem?.type === ActivityActionsTypeEnumDto.EDIT && isCreator) {
        return menuItem;
      }
      if (
        menuItem?.type === ActivityActionsTypeEnumDto.JOIN &&
        !isCreator &&
        !isParticipant &&
        !isPrivate
      ) {
        return menuItem;
      }
      if (menuItem?.type === ActivityActionsTypeEnumDto.INVITE && (isCreator || isParticipant)) {
        return menuItem;
      }
    }

    return undefined;
  });
};
