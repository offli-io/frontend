import { BuddyStateEnum } from "./buddy-state-enum.dto";

export interface IUsersSearchParamsDto {
  limit?: number;
  offset?: number;
  username?: string;
  sentRequestFilter?: BuddyStateEnum;
  receivedRequestFilter?: BuddyStateEnum;
  buddyIdToCheckInBuddies?: number;
}
