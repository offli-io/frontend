import { BuddyStateEnum } from "./buddy-state-enum.dto";

export interface IBuddyStateResponseDto {
  state: BuddyStateEnum;
  senderId: number;
  receiverId: number;
}
