import { BuddiesActionDefinitions } from '../buddies-action-definitions';
import { BuddyActionTypeEnum } from '../../../types/common/buddy-actions-type-enum.dto';

export interface IUseActivityMenuItemsProps {
  isCreator?: boolean;
  isParticipant?: boolean;
}

const CORE_ACTIONS = [BuddyActionTypeEnum.PROFILE, BuddyActionTypeEnum.REMOVE];

export const useBuddyActions = () => {
  return BuddiesActionDefinitions?.filter((menuItem) => {
    if (CORE_ACTIONS.includes(menuItem?.type)) {
      return menuItem;
    }
    // if (menuItem?.type === BuddyActionTypeEnum.DISMISS && isCreator) {
    //   return menuItem;
    // }
    // if (
    //   menuItem?.type === BuddyActionTypeEnum.LEAVE &&
    //   isParticipant &&
    //   !isCreator
    // ) {
    //   return menuItem;
    // }
    // if (
    //   menuItem?.type === BuddyActionTypeEnum.INVITE &&
    //   (isParticipant || isCreator)
    // ) {
    //   return menuItem;
    // }
    // if (menuItem?.type === BuddyActionTypeEnum.EDIT && isCreator) {
    //   return menuItem;
    // }
    // if (
    //   menuItem?.type === BuddyActionTypeEnum.JOIN &&
    //   !isCreator &&
    //   !isParticipant
    // ) {
    //   return menuItem;
    // }
    return undefined;
  });
};
