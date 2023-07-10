import { ActivityPriceOptionsEnum } from "../common/types";
import { ActivityVisibilityEnum } from "./activity-visibility-enum.dto";
import { ILocation } from "./location.dto";

export interface IUpdateActivityRequestDto {
    title?: string;
    location?: ILocation;
    datetime_from?: string;
    datetime_until?: string;
    visibility?: string;
    limit?: number;
    price?: string;
    description?: string;
    tags?: string[]
  }