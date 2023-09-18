import { IPerson } from "types/activities/activity.dto";

export interface IBuddiesResponseDto {
  buddies?: IPerson[];
  count?: number;
}
