import { Route, Routes as BaseRoutes } from 'react-router-dom'
import ActivitiesScreen from '../screens/activites-screen'
import ChatScreen from '../screens/chat-screen'
import CreateActivityScreen from '../screens/create-activity-screen/create-activity-screen'
import LoadingScreen from '../screens/loading-screen'
import LoginScreen from '../screens/login-screen'
import MyBuddiesScreen from '../screens/my-buddies-screen'
import NewPasswordScreen from '../screens/new-password-screen'
import PickUsernameScreen from '../screens/pick-username-screen'
import ProfileScreen from '../screens/profile-screen'
import RegistrationScreen from '../screens/registration-screen'
import ResetPasswordScreen from '../screens/reset-password-screen'
import SearchActivitesScreen from '../screens/search-activities-screen'
import VerificationScreen from '../screens/verification-screen'
import WelcomeScreen from '../screens/welcome-screen'
import { ApplicationLocations } from '../types/common/applications-locations.dto'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path={ApplicationLocations.LOADING} element={<LoadingScreen />} />
      <Route path={ApplicationLocations.LOGIN} element={<LoginScreen />} />
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
        element={<PickUsernameScreen />}
      />
      <Route path={ApplicationLocations.WELCOME} element={<WelcomeScreen />} />
      <Route path={ApplicationLocations.PROFILE} element={<ProfileScreen />} />
      <Route
        path={ApplicationLocations.RESET_PASSWORD}
        element={<ResetPasswordScreen />}
      />
      <Route
        path={ApplicationLocations.NEW_PASSWORD}
        element={<NewPasswordScreen />}
      />
      <Route
        path={ApplicationLocations.ACTIVITES}
        element={<ActivitiesScreen />}
      />
      <Route
        path={ApplicationLocations.CREATE}
        element={<CreateActivityScreen />}
      />
      <Route
        path={ApplicationLocations.SEARCH}
        element={<SearchActivitesScreen />}
      />
      <Route
        path={ApplicationLocations.BUDDIES}
        element={<MyBuddiesScreen />}
      />
      <Route path={ApplicationLocations.CHAT} element={<ChatScreen />} />
    </BaseRoutes>
  )
}

export default Routes
