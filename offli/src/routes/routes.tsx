import { Route, Routes as BaseRoutes } from 'react-router-dom'
import LoginScreen from '../screens/login-screen'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Registracia</div>} />
    </BaseRoutes>
  )
}

export default Routes
