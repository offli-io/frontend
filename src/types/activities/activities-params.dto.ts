import { ActivitiyParticipantStatusEnum } from './activity-participant-status-enum.dto';
import { ActivitySortColumnEnum } from './activity-sort-enum.dto';

export interface IActivitiesParamsDto {
  id?: number;
  text?: string;
  tag?: string[];
  datetimeFrom?: Date | null;
  datetimeUntil?: Date | null;
  limit?: number;
  offset?: number;
  lon?: number;
  lat?: number;
  participantId?: number;
  participantStatus?: ActivitiyParticipantStatusEnum;
  sort?: ActivitySortColumnEnum;
}
