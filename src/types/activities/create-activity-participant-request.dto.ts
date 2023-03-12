import { ActivityInviteStateEnum } from "./activity-invite-state-enum.dto";
import { IPerson } from "./activity.dto";

export interface ICreateActivityParticipantRequestDto extends IPerson {
  status?: ActivityInviteStateEnum;
  invitedBy?: string;
}
