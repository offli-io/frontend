import { ThemeOptionsEnumDto } from './theme-options.dto';

export interface IUserSettingsResponseDto {
  data?: {
    theme?: ThemeOptionsEnumDto;
  };
}
