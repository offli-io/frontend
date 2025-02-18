import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import React from 'react';
import { Routes as BaseRoutes, Route } from 'react-router-dom';
import AccountSettingsScreen from 'screens/account-settings-screen/account-settings-screen';
import ChangePasswordScreen from 'screens/account-settings-screen/components/change-password-screen';
import ActivitiesScreen from 'screens/activities-screen/activities-screen';
import RegistrationNeededScreen from 'screens/static-screens/registration-needed-screen';
import { getAuthToken } from 'utils/token.util';
import ActivityDetailsScreen from '../screens/activity-details-screen/activity-details-screen';
import { ActivityInviteScreen } from '../screens/activity-invite-screen/activity-invite-screen';
import { ActivityMembersScreen } from '../screens/activity-members-screen/activity-members-screen';
import AuthenticationMethodScreen from '../screens/authentication-method-screen';
import ChooseLocationScreen from '../screens/choose-location-screen';
import CreateActivityScreen from '../screens/create-activity-screen/create-activity-screen';
import EditActivityScreen from '../screens/edit-activity-screen/edit-activity-screen';
import EditProfileScreen from '../screens/edit-profile-screen/edit-profile-screen';
import ExploreScreen from '../screens/explore-screen/explore-screen';
import ForgottenPasswordScreen from '../screens/forgotten-password-screen/forgotten-password-screen';
import LoginScreen from '../screens/login-screen/login-screen';
import MapScreen from '../screens/map-screen';
import MyBuddiesScreen from '../screens/my-buddies-screen/my-buddies-screen';
import NotificationsScreen from '../screens/notifications-screen/notifications-screen';
import PickUsernameScreen from '../screens/pick-username-screen';
import ProfileScreen from '../screens/profile-screen/profile-screen';
import { ProfileEntryTypeEnum } from '../screens/profile-screen/types/profile-entry-type';
import RegistrationScreen from '../screens/registration-screen/registration-screen';
import ResetPasswordScreen from '../screens/reset-password-screen';
import SearchScreen from '../screens/search-screen/search-screen';
import SettingsScreen from '../screens/settings-screen/settings-screen';
import LoadingScreen from '../screens/static-screens/loading-screen';
import TestScreen from '../screens/test-screen';
import VerificationScreen from '../screens/verification-screen/verification-screen';
import { IActivityListRestDto } from '../types/activities/activity-list-rest.dto';
import { IActivityRestDto } from '../types/activities/activity-rest.dto';
import { ApplicationLocations } from '../types/common/applications-locations.dto';

const Routes = () => {
  const { userInfo, stateToken, setStateToken, setUserInfo } =
    React.useContext(AuthenticationContext);

  // moved functionality from private routes in future outsource this in separate hook
  // or when again implementing private routes keep it there
  const token = getAuthToken();
  const userIdFromStorage = localStorage.getItem('userId');

  React.useEffect(() => {
    if (!stateToken && !!token) {
      setStateToken(token);
    }
  }, [stateToken, token]);

  React.useEffect(() => {
    if (!userInfo && !!userIdFromStorage) {
      setUserInfo && setUserInfo({ id: Number(userIdFromStorage) });
    }
  }, [userInfo, userIdFromStorage]);

  return (
    <BaseRoutes>
      <Route path={ApplicationLocations.LOADING} element={<LoadingScreen />} />
      <Route path={ApplicationLocations.LOGIN} element={<LoginScreen />} />

      <Route path={ApplicationLocations.FORGOTTEN_PASSWORD} element={<ForgottenPasswordScreen />} />
      <Route
        path={ApplicationLocations.AUTHENTICATION_METHOD}
        element={<AuthenticationMethodScreen />}
      />
      <Route path={'/test'} element={<TestScreen />} />
      <Route path={ApplicationLocations.REGISTER} element={<RegistrationScreen />} />

      <Route path={ApplicationLocations.VERIFY} element={<VerificationScreen />} />
      <Route path={ApplicationLocations.PICK_USERNAME} element={<PickUsernameScreen />} />
      {/* <Route element={<PrivateRoutes />}> */}
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
      <Route path={ApplicationLocations.EDIT_PROFILE} element={<EditProfileScreen />} />
      <Route path={ApplicationLocations.RESET_PASSWORD} element={<ResetPasswordScreen />} />

      <Route path={ApplicationLocations.EXPLORE} element={<ExploreScreen />} />
      <Route path={ApplicationLocations.CHOOSE_LOCATION} element={<ChooseLocationScreen />} />
      <Route
        path={`${ApplicationLocations.ACTIVITY_DETAIL}`}
        element={<ActivityDetailsScreen type="detail" />}
      />
      <Route
        path={`${ApplicationLocations.ACTIVITY_DETAIL}/:id`}
        element={<ActivityDetailsScreen type="detail" />}
      />
      <Route
        path={`${ApplicationLocations.ACTIVITY_INVITE}/:id`}
        element={<ActivityDetailsScreen type="request" />}
      />
      <Route
        path={`${ApplicationLocations.ACTIVITY_MEMBERS}/:id`}
        element={<ActivityMembersScreen />}
      />
      <Route path={`${ApplicationLocations.EDIT_ACTIVITY}/:id`} element={<EditActivityScreen />} />
      <Route
        path={`${ApplicationLocations.ACTIVITY_INVITE_MEMBERS}/:id`}
        element={<ActivityInviteScreen />}
      />
      <Route
        path={ApplicationLocations.CREATE}
        element={userInfo?.id ? <CreateActivityScreen /> : <RegistrationNeededScreen />}
      />
      <Route path={ApplicationLocations.SEARCH} element={<SearchScreen />} />
      <Route path={ApplicationLocations.MAP} element={<MapScreen<IActivityListRestDto> />} />
      <Route
        path={`${ApplicationLocations.MAP}/:activityId`}
        element={<MapScreen<IActivityRestDto> />}
      />

      <Route path={ApplicationLocations.SETTINGS} element={<SettingsScreen />} />
      <Route path={ApplicationLocations.NOTIFICATIONS} element={<NotificationsScreen />} />
      <Route path={ApplicationLocations.BUDDIES} element={<MyBuddiesScreen />} />

      <Route path={ApplicationLocations.ACCOUNT_SETTINGS} element={<AccountSettingsScreen />} />
      <Route path={ApplicationLocations.CHANGE_PASSWORD} element={<ChangePasswordScreen />} />

      <Route
        path={`${ApplicationLocations.ACTIVITIES}/:activeTab`}
        element={userInfo?.id ? <ActivitiesScreen /> : <RegistrationNeededScreen />}
      />
      {/* </Route> */}
    </BaseRoutes>
  );
};

export default Routes;
