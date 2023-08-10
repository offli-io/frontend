import { IActivity } from "./activity.dto";

export interface IActivityListRestDto {
  activities: IActivity[];
  count: number;
}
