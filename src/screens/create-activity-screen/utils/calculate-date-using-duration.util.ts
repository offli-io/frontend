import { add, setHours, setMinutes } from "date-fns";
import { ActivityDurationTypeEnumDto } from "types/activities/activity-duration-type-enum.dto";

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
  timeFrom,
}: ICalculateDateUsingDurationProps) => {
  const fromTimeValues = timeFrom?.split(":");
  const _datetimeFrom = datetimeFrom
    ? setMinutes(
        setHours(datetimeFrom, Number(fromTimeValues?.[0])),
        Number(fromTimeValues?.[1])
      )
    : undefined;

  const datetimeUntil = add(_datetimeFrom as Date, {
    [durationType as string]: duration,
  });

  return { dateTimeFrom: _datetimeFrom, datetimeUntil };
};
