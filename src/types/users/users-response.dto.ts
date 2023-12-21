import { IPersonExtended } from 'types/activities/activity.dto';
import { IBuddyStateDto } from './buddy-state.dto';

export interface IUsersResponseDto {
  users: IPersonExtended[];
  count: number;
  buddieStates: IBuddyStateDto[];
}
