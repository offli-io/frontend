import { AppleAuthCodeFromEnum } from './apple-auth-code-from-enum.dto';
import { IAppleAuthorizeRequestDto } from './apple-authorize-request-dto';

export interface IAppleAuthorizationParamsDto {
  from?: AppleAuthCodeFromEnum;
  state?: any;
  values?: IAppleAuthorizeRequestDto;
  signal?: AbortSignal;
}
