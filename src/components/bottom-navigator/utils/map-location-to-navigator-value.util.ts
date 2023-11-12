import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

export const mapLocationToNavigatorValue = (location: ApplicationLocations) => {
  if (
    [
      ApplicationLocations.EXPLORE,
      ApplicationLocations.CREATE,
      ApplicationLocations.ACTIVITIES,
    ].includes(location)
  ) {
    return location;
  } else {
    if (
      [
        ApplicationLocations.EDIT_PROFILE,
        ApplicationLocations.BUDDIES,
        ApplicationLocations.USER_PROFILE,
      ].includes(location)
    ) {
      return ApplicationLocations.PROFILE;
    }
    if (
      [
        ApplicationLocations.SEARCH,
        ApplicationLocations.MAP,
        ApplicationLocations.ACTIVITY_DETAIL,
      ].includes(location)
    ) {
      return ApplicationLocations.EXPLORE;
    }
  }
};
