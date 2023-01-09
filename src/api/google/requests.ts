import axios from 'axios'
import { CLIENT_ID, SCOPE } from '../../utils/common-constants'

//TODO add interface for google event
export const addEventToCalendar = (calendarId?: string, event?: any) => {
  try {
    const googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: async tokenResponse => {
        if (tokenResponse && tokenResponse.access_token) {
          //TODO calendarId is logged in user mail,
          const promise = axios.post(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
            event,
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          )
          console.log(promise)
          return promise
        }
      },
    })
    googleTokenClient?.requestAccessToken()
  } catch (err) {
    console.error(err)
  }
}
