import { BuddyStateEnum } from './buddy-state-enum.dto';

export interface IBuddyStateDto {
  state?: BuddyStateEnum;
  sender_id?: number;
  receiver_id: number;
}
