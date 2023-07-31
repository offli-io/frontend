import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

export const mapLocationToNavigatorValue = (location: ApplicationLocations) => {
  if (
    [
      ApplicationLocations.ACTIVITIES,
      ApplicationLocations.CREATE,
      ApplicationLocations.PROFILE,
    ].includes(location)
  ) {
    return location;
  } else {
    if (
      [
        ApplicationLocations.EDIT_PROFILE,
        ApplicationLocations.BUDDIES,
        ApplicationLocations.ADD_BUDDIES,
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
      return ApplicationLocations.ACTIVITIES;
    }
  }
};
