import { ActivitiyParticipantStatusEnum } from './activity-participant-status-enum.dto';

export interface IListParticipantsResponseDto {
  success: boolean;
  errors: string[];
  count: number;
  participants: IParticipantDto[];
}

export interface IParticipantDto {
  id: number;
  name: string;
  username: string;
  profile_photo: string;
  status: ActivitiyParticipantStatusEnum;
}
