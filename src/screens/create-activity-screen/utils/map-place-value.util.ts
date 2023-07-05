import { ILocation } from "../../../types/activities/location.dto";
import { IPlaceExternalApiResultDto } from "../../../types/activities/place-external-api.dto";

export const mapPlaceValue = (
  value?: ILocation | IPlaceExternalApiResultDto
): IPlaceExternalApiResultDto | undefined => {
  if (value) {
    // if location was already selected and user is navigating back map name to proper format
    if ("coordinates" in value && "name" in value) {
      // then I know its ILocation type
      return {
        formatted: value?.name,
        lat: value?.coordinates?.lat,
        lon: value?.coordinates?.lon,
      } as IPlaceExternalApiResultDto;
    } else return value as IPlaceExternalApiResultDto;
  }
};
