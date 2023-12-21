import { BuddyStateEnum } from './buddy-state-enum.dto';

export interface IBuddyStateDto {
  state?: BuddyStateEnum;
  senderId?: number;
  receiverId: number;
}
