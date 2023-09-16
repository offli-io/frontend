import { IPersonExtended } from "types/activities/activity.dto";

export interface IUsersResponseDto {
  users: IPersonExtended[];
  count: number;
}
