export interface ICreateGoogleEventWithTokenRequestDto {
  start: string | null;
  end: string | null;
  name: string;
  auth_code: string;
}
