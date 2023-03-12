import { ActivityVisibilityEnum } from "./activity-visibility-enum.dto";
import { ILocation } from "./location.dto";

export interface IPerson {
  id: string;
  name: string;
  username: string;
  profile_photo: string;
}

export interface IPersonExtended {
  id?: string;
  username?: string;
  name?: string;
  profile_photo_url?: string;
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
  id?: string;
  participants?: IPerson[];
  title?: string;
  description?: string;
  price?: string;
  title_picture?: string;
  creator?: IPerson;
  datetime_from?: Date | string;
  datetime_until?: Date | string;
  location?: ILocation;
  tags?: string[];
  //TODO mozne nejake enumy na "public/private"
  visibility?: ActivityVisibilityEnum | string;
  limit?: number;
}

export interface IActivitySearchParams {
  limit: number;
  offset: number;
  long: number;
  lat: number;
  tag: string[];
}
