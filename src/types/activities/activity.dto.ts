import { ActivitiyParticipantStatusEnum } from "./activity-participant-status-enum.dto";
import { ActivityVisibilityEnum } from "./activity-visibility-enum.dto";
import { ILocation } from "./location.dto";

export interface IPerson {
  id?: number;
  name?: string;
  username?: string;
  profile_photo?: string;
}

export interface IPersonExtended {
  id?: number;
  username?: string;
  name?: string;
  profile_photo?: string;
  buddies?: IPerson[] | null;
  buddies_count?: number;
  activities?: string[] | null;
  email?: string;
  enjoyed_together_last_month_count?: number;
  new_buddies_last_month_count?: number;
  activities_created_last_month_count?: number;
  activities_participated_last_month_count?: number;
  about_me?: string | null;
  birthdate?: Date | null;
  location?: ILocation | null;
  instagram?: string;
  instagram_photos?: string[];
  userPreferredColor?: string | null;
  background_color?: string | null;
}

export interface IActivityLocation {
  name: string;
  coordinates: number[];
}

export interface IActivityLimit {
  activated: boolean;
  max_participants: number;
}
export interface IActivity {
  id?: number;
  title?: string;
  description?: string;
  price?: number | null;
  title_picture?: string;
  datetime_from?: Date | string;
  datetime_until?: Date | string;
  location?: ILocation | null;
  tags?: string[];
  participants_thumb?: IPerson[];
  //TODO mozne nejake enumy na "public/private"
  visibility?: ActivityVisibilityEnum | string;
  limit?: number;
  creator?: IPerson;
  creator_id?: number;
  canceled?: boolean;
  count_confirmed?: number;
  count_invited?: number;
  count_rejected?: number;
  created_at?: Date;
  modified_at?: string;
  participant_status?: ActivitiyParticipantStatusEnum | null;
}

export interface IActivitySearchParams {
  limit: number;
  offset: number;
  long: number;
  lat: number;
  tag: string[];
}
