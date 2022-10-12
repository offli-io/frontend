import { ReactElement, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CustomizationProvider } from '../assets/theme/customization-provider'
import BottomNavigator from '../components/bottom-navigator'
import OffliHeader from '../components/offli-header'
import Routes from './routes'

const Router: React.FC = (): ReactElement => {
  const token = false
  return (
    <CustomizationProvider>
      <Suspense fallback={<p>Loading ...</p>}>
        <BrowserRouter>
          {/* conditional rendering when token is received */}
          {!token && <OffliHeader />}
          <Routes />
          {!token && <BottomNavigator />}
        </BrowserRouter>
      </Suspense>
    </CustomizationProvider>
  )
}

export default Router
