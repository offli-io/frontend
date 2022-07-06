import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoginScreen from '../screens/login-screen'
import PickUsernameScreen from '../screens/pick-username-screen'
import RegistrationScreen from '../screens/registration-screen'
import VerificationScreen from '../screens/verification-screen'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<RegistrationScreen />} />
      <Route path="/verification" element={<VerificationScreen />} />
      <Route path="/pick-username" element={<PickUsernameScreen />} />
    </BaseRoutes>
  )
}

export default Routes
