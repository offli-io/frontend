import React from 'react'
import { Box, Button } from '@mui/material'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { CLIENT_ID, SCOPE } from '../utils/common-constants'
import { addEventToCalendar } from '../api/google/requests'

const event = {
  summary: 'Test event Offli',
  location: '',
  start: {
    dateTime: '2022-12-18T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2022-12-18T17:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },
      { method: 'popup', minutes: 10 },
    ],
  },
}

const SearchActivitesScreen = () => {
  // const { googleTokenClient } = React.useContext(AuthenticationContext)
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
      <Button onClick={() => addEventToCalendar('thefaston@gmail.com', event)}>
        Create calendar Event
      </Button>
    </>
  )
}

export default SearchActivitesScreen
