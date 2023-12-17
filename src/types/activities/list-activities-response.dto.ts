import { IActivity } from './activity.dto';

export interface IListActivitiesResponseDto {
  count?: number;
  activities?: IActivity[];
}
