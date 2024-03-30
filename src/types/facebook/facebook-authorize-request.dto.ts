export interface IFacebookAuthorizeRequestDto {
  auth_code: string;
  redirect_uri: string;
  username?: string;
}
