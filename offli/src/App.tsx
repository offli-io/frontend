import { Box } from '@mui/material'
import './App.css'
import Router from './routes/router'

import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Box sx={{ height: '100vh' }}>
        <Router />
      </Box>

      {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default App
