import { Box } from '@mui/material'
import './App.css'
import Router from './routes/router'
import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthenticationProvider } from './assets/theme/authentication-provider'
import { ReactNode } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'

const queryClient = new QueryClient()

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
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ height: '100vh' }}>
            <Router />
          </Box>
        </LocalizationProvider>

        {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </AuthenticationProvider>
  )
}

export default App
