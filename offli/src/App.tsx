import { Box } from '@mui/material'
import './App.css'
import Router from './routes/router'

import { QueryClientProvider, QueryClient } from 'react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ height: '100vh' }}>
        <Router />
      </Box>
    </QueryClientProvider>
  )
}

export default App
