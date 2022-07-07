import { ReactElement, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CustomizationProvider } from '../assets/theme/customization-provider'
import BottomNavigator from '../components/bottom-navigator'
import Routes from './routes'

const Router: React.FC = (): ReactElement => {
  return (
    <CustomizationProvider>
      <Suspense fallback={<p>Loading ...</p>}>
        <BrowserRouter>
          <Routes />
          {
            //conditional rendering when token is received
            true && <BottomNavigator />
          }
        </BrowserRouter>
      </Suspense>
    </CustomizationProvider>
  )
}

export default Router
