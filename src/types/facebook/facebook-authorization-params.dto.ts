import { FacebookAuthCodeFromEnumDto } from './facebook-auth-code-from-enum.dto';
import { IFacebookAuthorizeRequestDto } from './facebook-authorize-request.dto';

export interface IFacebookAuthorizationParamsDto {
  from: FacebookAuthCodeFromEnumDto;
  state?: any;
  values?: IFacebookAuthorizeRequestDto;
  signal?: AbortSignal;
}
