import { Route, Routes as BaseRoutes } from "react-router-dom";
import { PrivateRoutes } from "../components/private-routes";
import ActivitiesScreen from "../screens/my-activities-screen/my-activities-screen";
import ChatScreen from "../screens/chat-screen";
import CreateActivityScreen from "../screens/create-activity-screen/create-activity-screen";
import EditProfileScreen from "../screens/edit-profile-screen";
import LoadingScreen from "../screens/loading-screen";
import LoginOrRegisterScreen from "../screens/login-or-register";
import LoginScreen from "../screens/login-screen";
import MyBuddiesScreen from "../screens/my-buddies-screen/my-buddies-screen";
import NewPasswordScreen from "../screens/new-password-screen";
import PickUsernamePhotoScreen from "../screens/pick-username-photo-screen";
import ProfileScreen from "../screens/profile-screen";
import RegistrationScreen from "../screens/registration-screen";
import ResetPasswordScreen from "../screens/reset-password-screen";
import SearchScreen from "../screens/search-screen";
import SelectProfilePictureScreen from "../screens/select-picture-screen";
import SettingsScreen from "../screens/settings-screen/settings-screen";
import TestScreen from "../screens/test-screen";
import VerificationScreen from "../screens/verification-screen";
import WelcomeScreen from "../screens/welcome-screen";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { getAuthToken } from "../utils/token.util";
import ActivityDetailsScreen from "../screens/activity-details-screen/activity-details-screen";
import NotificationsScreen from "../screens/notifications-screen/notifications-screen";

import { ActivityMembersScreen } from "../screens/activity-members-screen/activity-members-screen";
import MapScreen from "../screens/map-screen";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";
import AuthenticationMethodScreen from "../screens/authentication-method-screen";
import ForgottenPasswordScreen from "../screens/forgotten-password-screen/forgotten-password-screen";

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
          element={<ProfileScreen type="profile" />}
        />
        <Route
          path={`${ApplicationLocations.PROFILE}/request/:id`}
          element={<ProfileScreen type="request" />}
        />
        <Route
          path={`${ApplicationLocations.PROFILE}/buddy/:id`}
          element={<ProfileScreen type="buddy" />}
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
          path={`${ApplicationLocations.ACTIVITY_ID}/:id`}
          element={<ActivityDetailsScreen type="detail" />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITIES}/request/:id`}
          element={<ActivityDetailsScreen type="request" />}
        />
        <Route
          path={`${ApplicationLocations.ACTIVITY_ID}/:id/members`}
          element={<ActivityMembersScreen />}
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
        <Route path={ApplicationLocations.CHAT} element={<ChatScreen />} />
      </Route>
    </BaseRoutes>
  );
};

export default Routes;
