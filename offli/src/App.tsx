import { Box } from '@mui/material'
import './App.css'
import Router from './routes/router'

function App() {
  return (
    <Box sx={{ paddingInline: 2, height: '100%' }}>
      <Router />
    </Box>
  )
}

export default App
