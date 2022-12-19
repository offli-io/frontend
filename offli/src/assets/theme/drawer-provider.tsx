import React from 'react'

import { SwipeableDrawer, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

interface IDrawerData {
  open?: boolean
  content?: React.ReactElement
}

interface IDrawerContext {
  toggleDrawer: (drawerData: IDrawerData) => void
}

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}))

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
        sx={{
          '& .MuiPaper-root': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            pt: 3,
            pb: 2,
            px: 1,
          },
        }}
      >
        <Puller />
        {drawerData?.content}
      </SwipeableDrawer>
    </DrawerContext.Provider>
  )
}
