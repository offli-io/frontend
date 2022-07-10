import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoadingScreen from '../screens/loading-screen'
import LoginScreen from '../screens/login-screen'
import NewPasswordScreen from '../screens/new-password-screen'
import PickUsernameScreen from '../screens/pick-username-screen'
import ProfileEmptyScreen from '../screens/profile-empty-screen'
import RegistrationScreen from '../screens/registration-screen'
import ResetPasswordScreen from '../screens/reset-password-screen'
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
      <Route
        path={ApplicationLocations.PROFILE_EMPTY}
        element={<ProfileEmptyScreen />}
      />
      <Route
        path={ApplicationLocations.RESET_PASSWORD}
        element={<ResetPasswordScreen />}
      />
      <Route
        path={ApplicationLocations.NEW_PASSWORD}
        element={<NewPasswordScreen />}
      />
    </BaseRoutes>
  )
}

export default Routes
