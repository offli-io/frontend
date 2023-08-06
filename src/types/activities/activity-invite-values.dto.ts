import { ActivityInviteStateEnum } from "./activity-invite-state-enum.dto";

export interface IActivityInviteValuesDto {
  id: number;
  status: ActivityInviteStateEnum;
  invited_by_id: number;
}
