import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

export const mapPathnameToHeaderTitle = (pathname?: ApplicationLocations) => {
  //TODO move this to switch

  if (pathname?.startsWith(ApplicationLocations.ACTIVITY_INVITE)) {
    return "Activity invite";
  }

  if (pathname?.startsWith(ApplicationLocations.USER_PROFILE)) {
    return "User profile";
  }

  if (pathname?.startsWith(ApplicationLocations.BUDDY_REQUEST)) {
    return "Buddy request";
  }

  if (pathname?.startsWith(ApplicationLocations.ACTIVITY_DETAIL)) {
    return "Activity detail";
  }

  if (pathname?.startsWith(ApplicationLocations.ACTIVITY_MEMBERS)) {
    return "Activity members";
  }

  if (pathname?.startsWith(ApplicationLocations.NOTIFICATIONS)) {
    return "Notifications";
  }

  if (pathname?.startsWith(ApplicationLocations.ACTIVITY_INVITE_MEMBERS)) {
    return "Invite buddies";
  }

  // assuming there is ID behind the slash TODO in the future better handling of these paths
  if (pathname?.startsWith(`${ApplicationLocations.MAP}/`)) {
    return "Activity location";
  }

  switch (pathname) {
    case ApplicationLocations.EDIT_PROFILE:
      return "Edit profile";
    case ApplicationLocations.BUDDIES:
      return "Buddies";
    case ApplicationLocations.SEARCH:
      return "Search activities";
    case ApplicationLocations.SETTINGS:
      return "Settings";
    case ApplicationLocations.MAP:
      return "Map";
    case ApplicationLocations.ACCOUNT_SETTINGS:
      return "Account settings";
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
