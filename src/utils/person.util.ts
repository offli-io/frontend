import { IBuddyStateDto } from "types/users/buddy-state.dto";
import { ActivitiyParticipantStatusEnum } from "../types/activities/activity-participant-status-enum.dto";
import { IPerson } from "../types/activities/activity.dto";
import { IParticipantDto } from "../types/activities/list-participants-response.dto";
import { BuddyStateEnum } from "types/users";

export const isAlreadyParticipant = (
  participants: IParticipantDto[] = [],
  potentialParticipant: IPerson
) => {
  return participants?.some(
    ({ id }) => id === potentialParticipant?.id
    // Dont check status because status will be checked in query params when querying status !== invited, confirmed, rejected
    //   potentialParticipant?.status === null
  );
};

export const userSentYouBuddyRequest = (
  buddyStates: IBuddyStateDto[] = [],
  receiverId: number,
  senderId: number
) => {
  return !!buddyStates?.find(
    ({ receiverId: potentialReceiverId, senderId: potentialSenderId }) =>
      potentialReceiverId === receiverId && potentialReceiverId === senderId
  );
};

export const isExistingPendingBuddyState = (
  buddyStates: IBuddyStateDto[] = [],
  receiverId: number,
  senderId: number
) => {
  return !!buddyStates?.find(
    ({ receiverId: potentialReceiverId, senderId: potentialSenderId, state }) =>
      state === BuddyStateEnum.PENDING &&
      potentialReceiverId === receiverId &&
      potentialSenderId === senderId
  );
};
