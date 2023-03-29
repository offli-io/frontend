export interface IUpdateUserRequestDto {
  username?: any;
  email?: string;
  name?: string;
  profile_photo_url?: string;
  about_me?: string;
  location?: string;
  birthdate?: Date | null;
  instagram?: string;
}
