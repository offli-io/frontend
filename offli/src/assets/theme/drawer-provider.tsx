import React from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { useServiceInterceptors } from '../../hooks/use-service-interceptors'
import { setAuthToken } from '../../utils/token.util'
import { IPerson, IPersonExtended } from '../../types/activities/activity.dto'
import { SwipeableDrawer } from '@mui/material'

interface IDrawerData {
  open?: boolean
  content?: React.ReactElement
}

interface IDrawerContext {
  toggleDrawer: (drawerData: IDrawerData) => void
}

export const DrawerContext = React.createContext<IDrawerContext>(
  {} as IDrawerContext
)

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerData, toggleDrawer] = React.useState<IDrawerData>({
    open: false,
  })

  return (
    <DrawerContext.Provider value={{ toggleDrawer }}>
      {children}
      <SwipeableDrawer
        anchor="bottom"
        open={Boolean(drawerData?.open)}
        onOpen={() => console.log('wtf')}
        onClose={() => toggleDrawer({ open: false, content: undefined })}
      >
        {drawerData?.content}
      </SwipeableDrawer>
    </DrawerContext.Provider>
  )
}
