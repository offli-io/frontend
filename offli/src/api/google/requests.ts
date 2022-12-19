import axios from 'axios'

//TODO add interface for google event
export const addEventToCalendar = (
  calendarId?: string,
  accessToken?: string,
  event?: any
) => {
  const promise = axios.post(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    event,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return promise
}
