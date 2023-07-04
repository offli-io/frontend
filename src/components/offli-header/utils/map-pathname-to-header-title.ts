import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

export const mapPathnameToHeaderTitle = (pathname?: ApplicationLocations) => {
  switch (pathname) {
    case ApplicationLocations.EDIT_PROFILE:
      return "Edit profile";
    case ApplicationLocations.BUDDIES:
      return "Buddies";
    case ApplicationLocations.ADD_BUDDIES:
      return "Find new buddies";
    case ApplicationLocations.SEARCH:
      return "Search activities";
    case ApplicationLocations.MAP:
      return "Map";
    default:
      return "";
  }
};
