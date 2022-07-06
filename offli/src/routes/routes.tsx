import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoginScreen from '../screens/login-screen'
import RegistrationScreen from '../screens/registration-screen'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<RegistrationScreen />} />
    </BaseRoutes>
  )
}

export default Routes
