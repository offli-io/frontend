import { ActivityInviteStateEnum } from "./activity-invite-state-enum.dto";
import { IPerson } from "./activity.dto";

export interface ICreateActivityParticipantRequestDto extends IPerson {
  id: number;
  status?: ActivityInviteStateEnum;
  invited_by?: number;
}
