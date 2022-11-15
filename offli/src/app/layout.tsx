import BottomNavigator from '../components/bottom-navigator'
import { getAuthToken } from '../utils/token.util'

interface ILayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const token = getAuthToken()
  return (
    <>
      {children}
      {token && <BottomNavigator />}
    </>
  )
}
