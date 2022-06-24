import { ReactElement, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CustomizationProvider } from '../assets/theme/customization-provider'
import Routes from './routes'

const Router: React.FC = (): ReactElement => {
  return (
    <CustomizationProvider>
      <Suspense fallback={<p>Loading ...</p>}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Suspense>
    </CustomizationProvider>
  )
}

export default Router
