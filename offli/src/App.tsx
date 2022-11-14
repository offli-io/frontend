import { Box } from '@mui/material'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
      cacheTime: 1000 * 30, //30 seconds
      refetchInterval: 1000 * 30, //30 seconds
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 1000 * 30,
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
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <AuthenticationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ height: '100vh' }}>
            <Router />
          </Box>
        </LocalizationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthenticationProvider>
    </QueryClientProvider>
  )
}

export default App
