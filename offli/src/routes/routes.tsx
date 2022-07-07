import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoginScreen from '../screens/login-screen'
import PickUsernameScreen from '../screens/pick-username-screen'
import ProfileEmptyScreen from '../screens/profile-empty-screen'
import RegistrationScreen from '../screens/registration-screen'
import VerificationScreen from '../screens/verification-screen'
import WelcomeScreen from '../screens/welcome-screen'

import { ApplicationLocations } from '../types/common/applications-locations.dto'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<LoginScreen />} />
      <Route path={ApplicationLocations.LOGIN} element={<div>Login</div>} />
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
    </BaseRoutes>
  )
}

export default Routes
