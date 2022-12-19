import React from 'react'
import { Box, Button } from '@mui/material'
import { AuthenticationContext } from '../assets/theme/authentication-provider'

const SearchActivitesScreen = () => {
  const { googleTokenClient } = React.useContext(AuthenticationContext)
  return (
    <>
      <Box
        sx={{
          // height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        // className="backgroundImage"
      >
        Search
      </Box>
      <Button onClick={() => googleTokenClient?.requestAccessToken()}>
        Create calendar Event
      </Button>
    </>
  )
}

export default SearchActivitesScreen
