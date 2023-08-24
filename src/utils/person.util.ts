import { ActivitiyParticipantStatusEnum } from "../types/activities/activity-participant-status-enum.dto";
import { IPerson } from "../types/activities/activity.dto";
import { IParticipantDto } from "../types/activities/list-participants-response.dto";

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
