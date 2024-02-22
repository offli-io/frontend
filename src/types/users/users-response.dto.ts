import { IPerson } from 'types/activities/activity.dto';
import { IBuddyStateDto } from './buddy-state.dto';

export interface IUsersResponseDto {
  users: IPerson[];
  count: number;
  buddie_states: IBuddyStateDto[];
}
