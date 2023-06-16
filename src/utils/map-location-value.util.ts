import { ILocation } from "../types/activities/location.dto";
import { IPlaceExternalApiResultDto } from "../types/activities/place-external-api.dto";

export const mapLocationValue = (
  value?: ILocation | IPlaceExternalApiResultDto | null
): IPlaceExternalApiResultDto | null => {
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
  return null;
};

export const mapFormattedToValue = (
  value?: IPlaceExternalApiResultDto | null
): ILocation | null => {
  if (value) {
    // if location was already selected and user is navigating back map name to proper format
    if ("formatted" in value && "lat" in value && "lon" in value) {
      // then I know its ILocation type
      return {
        name: value?.formatted,
        coordinates: {
          lat: value?.lat,
          lon: value?.lon,
        },
      } as ILocation;
    } else return value as ILocation;
  }
  return null;
};

export const mapExternalApiOptions = (
  options?: IPlaceExternalApiResultDto[]
): ILocation[] => {
  return [
    ...(options ?? [])?.map(({ formatted, lat, lon }) => ({
      name: formatted,
      coordinates: {
        lat: lat,
        lon: lon,
      },
    })),
  ];
};
