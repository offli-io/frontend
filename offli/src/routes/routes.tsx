import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoginScreen from '../screens/login-screen'
import RegistrationScreen from '../screens/registration-screen'
import VerificationScreen from '../screens/verification-screen'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<RegistrationScreen />} />
      <Route path="/verification" element={<VerificationScreen />} />
    </BaseRoutes>
  )
}

export default Routes
