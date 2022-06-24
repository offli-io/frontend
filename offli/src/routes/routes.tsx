import { Route, Routes as BaseRoutes } from 'react-router-dom'

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="/" element={<div>cauko zdravim ta v appke</div>} />
    </BaseRoutes>
  )
}

export default Routes
