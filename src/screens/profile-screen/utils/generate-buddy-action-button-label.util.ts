import { BuddyStateEnum } from "../../../types/users/buddy-state-enum.dto";

export const generateBuddyActionButtonLabel = (
  buddyState?: BuddyStateEnum | null,
  userId?: number,
  senderId?: number | null
) => {
  if (buddyState === BuddyStateEnum.PENDING) {
    if (senderId === userId) {
      return "Buddy request sent";
    } else {
      return "Accept buddy request";
    }
  }
  if (buddyState === BuddyStateEnum.BLOCKED) {
    return "Rejected";
  }
  return "Add buddy";
};
