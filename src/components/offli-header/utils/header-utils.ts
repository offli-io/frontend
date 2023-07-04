import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

export const mapPathnameToHeaderTitle = (pathname?: ApplicationLocations) => {
  //TODO move this to switch
  if (pathname?.startsWith(ApplicationLocations.USER_PROFILE)) {
    return "User profile";
  }

  if (pathname?.startsWith(ApplicationLocations.BUDDY_REQUEST)) {
    return "Buddy request";
  }

  if (pathname?.startsWith(ApplicationLocations.BUDDY_PROFILE)) {
    return "Buddy profile";
  }

  switch (pathname) {
    case ApplicationLocations.EDIT_PROFILE:
      return "Edit profile";
    case ApplicationLocations.BUDDIES:
      return "Buddies";
    case ApplicationLocations.ADD_BUDDIES:
      return "Find new buddies";
    case ApplicationLocations.SEARCH:
      return "Search activities";
    case ApplicationLocations.SETTINGS:
      return "Settings";
    case ApplicationLocations.MAP:
      return "Map";
    default:
      return "";
  }
};

// export const mapBackFromCurrentLocation = (pathname?: ApplicationLocations) => {
//   switch (pathname) {
//     case ApplicationLocations.EDIT_PROFILE:
//       return ApplicationLocations.PROFILE;
//     case ApplicationLocations.BUDDIES:
//       return ApplicationLocations.PROFILE;
//     case ApplicationLocations.ADD_BUDDIES:
//       return ApplicationLocations.BUDDIES;
//     case ApplicationLocations.SEARCH:
//       return ApplicationLocations.ACTIVITIES
//     case ApplicationLocations.SETTINGS:
//       return "Settings";
//     case ApplicationLocations.MAP:
//       return "Map";
//     default:
//       return "";
//   }
// };
