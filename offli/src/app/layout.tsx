import BottomNavigator from '../components/bottom-navigator'

interface ILayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <BottomNavigator />
    </>
  )
}
