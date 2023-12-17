import { ITokenDto } from './token.dto';

export interface ILoginResponseDto {
  token: ITokenDto;
  user_id: number;
}
