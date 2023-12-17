import { IPerson } from '../../../types/activities/activity.dto';

export const isBuddy = (buddies: IPerson[] = [], potentialBuddyId: number = -1) => {
  return buddies?.some(({ id }) => id === potentialBuddyId);
};
