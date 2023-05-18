import { ProfileEntryTypeEnum } from "../types/profile-entry-type";

export const generateBackHeaderTitle = (type: ProfileEntryTypeEnum) => {
  switch (type) {
    case ProfileEntryTypeEnum.BUDDY:
      return "Buddy profile";
    case ProfileEntryTypeEnum.REQUEST:
      return "Buddy request";
    case ProfileEntryTypeEnum.USER_PROFILE:
      return "User profile";
    default:
      return "";
  }
};
