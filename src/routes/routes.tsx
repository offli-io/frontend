import { Routes as BaseRoutes, Route } from "react-router-dom";
import { PrivateRoutes } from "../components/private-routes";
import ActivityDetailsScreen from "../screens/activity-details-screen/activity-details-screen";
import ChatScreen from "../screens/chat-screen";
import CreateActivityScreen from "../screens/create-activity-screen/create-activity-screen";
import EditProfileScreen from "../screens/edit-profile-screen/edit-profile-screen";
import LoadingScreen from "../screens/loading-screen";
import LoginScreen from "../screens/login-screen";
import ActivitiesScreen from "../screens/my-activities-screen/my-activities-screen";
import MyBuddiesScreen from "../screens/my-buddies-screen/my-buddies-screen";
import NewPasswordScreen from "../screens/new-password-screen";
import NotificationsScreen from "../screens/notifications-screen/notifications-screen";
import PickUsernamePhotoScreen from "../screens/pick-username-photo-screen";
import ProfileScreen from "../screens/profile-screen/profile-screen";
import RegistrationScreen from "../screens/registration-screen";
import ResetPasswordScreen from "../screens/reset-password-screen";
import SearchScreen from "../screens/search-screen/search-screen";
import SelectProfilePictureScreen from "../screens/select-picture-screen";
import SettingsScreen from "../screens/settings-screen/settings-screen";
import TestScreen from "../screens/test-screen";
import VerificationScreen from "../screens/verification-screen/verification-screen";
import WelcomeScreen from "../screens/welcome-screen";
import { ActivityInviteScreen } from "../screens/activity-invite-screen/activity-invite-screen";
import { ActivityMembersScreen } from "../screens/activity-members-screen/activity-members-screen";
import AuthenticationMethodScreen from "../screens/authentication-method-screen";
import ChooseLocationScreen from "../screens/choose-location-screen";
import ChooseUsernameGooglePage from "../screens/choose-username-google-page";
import ForgottenPasswordScreen from "../screens/forgotten-password-screen/forgotten-password-screen";
import MapScreen from "../screens/map-screen";
import { ProfileEntryTypeEnum } from "../screens/profile-screen/types/profile-entry-type";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";
import EditActivityScreen from "../screens/edit-activity-screen/edit-activity-screen";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import LoginOrRegisterScreen from "screens/login-or-register";
import AccountSettingsScreen from "screens/account-settings-screen/account-settings-screen";

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path={ApplicationLocations.LOADING} element={<LoadingScreen />} />
      <Route path={ApplicationLocations.LOGIN} element={<LoginScreen />} />

      <Route
        path={ApplicationLocations.FORGOTTEN_PASSWORD}
        element={<ForgottenPasswordScreen />}
      />
      <Route
        path={ApplicationLocations.LOGIN_OR_REGISTER}
        element={<LoginOrRegisterScreen />}
      />
      <Route
        path={ApplicationLocations.AUTHENTICATION_METHOD}
        element={<AuthenticationMethodScreen />}
      />
      <Route path={"/test"} element={<TestScreen />} />
      <Route
        path={ApplicationLocations.REGISTER}
        element={<RegistrationScreen />}
      />

      <Route
        path={ApplicationLocations.VERIFY}
        element={<VerificationScreen />}
      />
      <Route
        path={ApplicationLocations.PICK_USERNAME}
        element={<PickUsernamePhotoScreen />}
      />
      <Route
        path={ApplicationLocations.SELECT_PROFILE_PICTURE}
        element={<SelectProfilePictureScreen />}
      />
      <Route element={<PrivateRoutes />}>
        <Route
          path={ApplicationLocations.WELCOME}
          element={<WelcomeScreen />}
        />
        <Route
          path={ApplicationLocations.PROFILE}
          element={<ProfileScreen type={ProfileEntryTypeEnum.PROFILE} />}
        />
        <Route
          path={`${ApplicationLocations.PROFILE}/request/:id`}
          element={<ProfileScreen type={ProfileEntryTypeEnum.REQUEST} />}
        />

        <Route
          path={`${ApplicationLocations.PROFILE}/user/:id`}
          element={<ProfileScreen type={ProfileEntryTypeEnum.USER_PROFILE} />}
        />
        <Route
          path={ApplicationLocations.EDIT_PROFILE}
          element={<EditProfileScreen />}
        />
        <Route
          path={ApplicationLocations.RESET_PASSWORD}
          element={<ResetPasswordScreen />}
        />

        <Route
          path={ApplicationLocations.NEW_PASSWORD}
          element={<NewPasswordScreen />}
        />
        <Route
          path={ApplicationLocations.ACTIVITIES}
          element={<ActivitiesScreen />}
        />
        <Route
          path={ApplicationLocations.CHOOSE_LOCATION}
          element={<ChooseLocationScreen />}
        />
        <Route
          path={ApplicationLocations.CHOOSE_USERNAME_GOOGLE}
          element={<ChooseUsernameGooglePage />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITY_DETAIL}`}
          element={<ActivityDetailsScreen type="detail" />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITY_DETAIL}/:id`}
          element={<ActivityDetailsScreen type="detail" />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITIES}/request/:id`}
          element={<ActivityDetailsScreen type="request" />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITY_MEMBERS}/:id`}
          element={<ActivityMembersScreen />}
        />
        <Route
          path={`${ApplicationLocations.EDIT_ACTIVITY}/:id`}
          element={<EditActivityScreen />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITY_INVITE_MEMBERS}/:id`}
          element={<ActivityInviteScreen />}
        />
        <Route
          path={ApplicationLocations.CREATE}
          element={<CreateActivityScreen />}
        />
        <Route path={ApplicationLocations.SEARCH} element={<SearchScreen />} />
        <Route
          path={ApplicationLocations.MAP}
          element={<MapScreen<IActivityListRestDto> />}
        />
        <Route
          path={`${ApplicationLocations.MAP}/:activityId`}
          element={<MapScreen<IActivityRestDto> />}
        />

        <Route
          path={ApplicationLocations.SETTINGS}
          element={<SettingsScreen />}
        />
        <Route
          path={ApplicationLocations.NOTIFICATIONS}
          element={<NotificationsScreen />}
        />
        <Route
          path={ApplicationLocations.BUDDIES}
          element={<MyBuddiesScreen />}
        />

        <Route
          path={ApplicationLocations.ACCOUNT_SETTINGS}
          element={<AccountSettingsScreen />}
        />

        <Route path={ApplicationLocations.CHAT} element={<ChatScreen />} />
      </Route>
    </BaseRoutes>
  );
};

export default Routes;
