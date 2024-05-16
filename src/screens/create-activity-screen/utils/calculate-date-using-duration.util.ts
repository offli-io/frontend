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
  if (timeFrom) {
    const time = new Date(timeFrom);
    const _datetimeFrom = datetimeFrom
      ? setMinutes(setHours(datetimeFrom, time.getHours()), time.getMinutes())
      : undefined;
    const datetimeUntil = add(_datetimeFrom as Date, {
      [durationType as string]: duration
    });

    return { dateTimeFrom: _datetimeFrom, datetimeUntil };
  }
  return {};
};
