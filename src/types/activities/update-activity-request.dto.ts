import { ActivityVisibilityEnum } from './activity-visibility-enum.dto';
import { ILocation } from './location.dto';

export interface IUpdateActivityRequestDto {
  title?: string;
  location?: ILocation;
  datetime_from?: string;
  datetime_until?: string;
  visibility?: ActivityVisibilityEnum;
  limit?: number;
  price?: string;
  description?: string;
  tags?: string[];
  canceled?: boolean;
  creator_id?: number;
  title_picture_url?: string;
}
