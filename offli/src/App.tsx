import { Box, Button } from '@mui/material'
import './App.css'
import Router from './routes/router'
import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthenticationProvider } from './assets/theme/authentication-provider'
import { ReactNode } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useServiceInterceptors } from './hooks/use-service-interceptors'
import { SnackbarKey, SnackbarProvider } from 'notistack'
import { DrawerProvider } from './assets/theme/drawer-provider'
import { CustomizationProvider } from './assets/theme/customization-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 1000 * 300, //5 minutes
      refetchInterval: 1000 * 300, //5 minutes
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 1000 * 300,
    },
    mutations: {
      retry: 0,
    },
  },
})

declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: ReactNode
  }
}

function App() {
  const handleCallbackResponse = (res: any) => {
    console.log(res)
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      // This hides the address bar:
      window.scrollTo(0, 1)
    }, 0)
  })
  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        '1080578312208-8vm5lbg7kctt890d0lagj46sphae7odu.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    })

    google.accounts.id.renderButton(
      document.getElementById('signIn') as HTMLElement,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: '270px',
      }
    )
  }, [])

  const notificationsRef = React.createRef<any>()

  const handleDismiss = React.useCallback(
    (key: SnackbarKey) => {
      notificationsRef.current.closeSnackbar(key)
    },
    [notificationsRef]
  )
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SnackbarProvider
        ref={notificationsRef}
        maxSnack={1}
        autoHideDuration={3000}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        action={key => (
          <Button onClick={() => handleDismiss(key)} sx={{ color: 'white' }}>
            Dismiss
          </Button>
        )}
      >
        <AuthenticationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CustomizationProvider>
              <Box sx={{ height: '100vh', overflow: 'hidden' }}>
                <DrawerProvider>
                  <Router />
                </DrawerProvider>
              </Box>
            </CustomizationProvider>
          </LocalizationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthenticationProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  )
}

export default App
