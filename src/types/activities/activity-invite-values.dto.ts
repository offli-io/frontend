import { ActivityInviteStateEnum } from './activity-invite-state-enum.dto';

export interface IActivityInviteValuesDto {
  status: ActivityInviteStateEnum;
  invited_by_id: number;
}
