import { ILocation } from "../activities/location.dto";

export interface IUpdateUserRequestDto {
  username?: any;
  email?: string;
  name?: string;
  profile_photo_url?: string;
  about_me?: string;
  location?: ILocation | null;
  birthdate?: Date | null;
  instagram?: string;
}
