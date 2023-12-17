import { gapi } from 'gapi-script';

// simple event format
// const event = {
//     summary: "Hello World",
//     location: "",
//     start: {
//       dateTime: "2022-08-28T09:00:00-07:00",
//       timeZone: "America/Los_Angeles",
//     },
//     end: {
//       dateTime: "2022-08-28T17:00:00-07:00",
//       timeZone: "America/Los_Angeles",
//     },
//     recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
//     attendees: [],
//     reminders: {
//       useDefault: false,
//       overrides: [
//         { method: "email", minutes: 24 * 60 },
//         { method: "popup", minutes: 10 },
//       ],
//     },
//   };

export const useGoogleCalendar = () => {
  // const calendarID = process.env.REACT_APP_CALENDAR_ID;
  // const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  // const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;

  const getEvents = (calendarID?: string, apiKey?: string) => {
    function initiate() {
      gapi.client
        .init({
          apiKey: apiKey
        })
        .then(function () {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`
          });
        })
        .then(
          (response: any) => {
            const events = response.result.items;
            console.log(events);
          },
          function (err: any) {
            return [false, err];
          }
        );
    }
    gapi.load('client', initiate);
  };

  const addEvent = (calendarID?: string, event?: any, accessToken?: string) => {
    function initiate() {
      gapi.client
        // .init({
        //   apiKey: apiKey,
        // })
        .request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
          method: 'POST',
          body: event,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(
          (response: any) => {
            return [true, response];
          },
          function (err: any) {
            console.log(err);
            return [false, err];
          }
        );
    }
    gapi.load('client', initiate);
  };

  return { addEvent, getEvents };
};
