import { ILocation } from "../activities/location.dto";

export interface IUpdateUserRequestDto {
  username?: any;
  email?: string;
  name?: string;
  profile_photo?: string | null;
  title_photo?: string | null;
  about_me?: string;
  location?: ILocation | null;
  birthdate?: Date | null;
  instagram?: string | null;
}
