import { addHours, format, parseISO } from "date-fns";

export function convertDateToUTC(inputDateString?: string) {
  if (!inputDateString) {
    return null;
  }
  // Step 1: Parse the input Date string into a JavaScript Date object
  const date = parseISO(inputDateString);

  // Step 2: Remove milliseconds and time information by setting the time to midnight (00:00:00)
  const formattedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Step 3: Set the timezone offset to UTC+2 hours
  const timezoneOffsetHours = 2;
  const dateWithOffset = addHours(formattedDate, timezoneOffsetHours);

  // Step 4: Format the Date object into the desired output string format
  const formattedDateString = format(dateWithOffset, "yyyy-M-d'T'HH:mm:ssxxx");

  return formattedDateString;
}
