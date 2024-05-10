import { add, setHours, setMinutes } from 'date-fns';
import { ActivityDurationTypeEnumDto } from 'types/activities/activity-duration-type-enum.dto';

interface ICalculateDateUsingDurationProps {
  datetimeFrom?: Date;
  timeFrom?: string | null;
  duration?: number;
  durationType?: ActivityDurationTypeEnumDto;
}

export const calculateDateUsingDuration = ({
  datetimeFrom,
  duration,
  durationType,
  timeFrom
}: ICalculateDateUsingDurationProps) => {
  let hour = 0;
  let minute = 0;

  // Parse timeFrom string to get hour and minute values
  if (typeof timeFrom === 'string') {
    const timeParts = timeFrom.match(/^(\d{1,2}):(\d{2})$/);
    if (timeParts) {
      hour = parseInt(timeParts[1], 10);
      minute = parseInt(timeParts[2], 10);
    }
  }

  const _datetimeFrom = datetimeFrom ? setMinutes(setHours(datetimeFrom, hour), minute) : undefined;

  const datetimeUntil = add(_datetimeFrom as Date, {
    [durationType as string]: duration
  });

  return { dateTimeFrom: _datetimeFrom, datetimeUntil };
};
