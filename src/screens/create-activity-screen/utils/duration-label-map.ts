import { ActivityDurationTypeEnumDto } from 'types/activities/activity-duration-type-enum.dto';

export const DurationLabelMap = {
  [ActivityDurationTypeEnumDto.DAYS]: 'day(s)',
  [ActivityDurationTypeEnumDto.MINUTES]: 'minute(s)',
  [ActivityDurationTypeEnumDto.HOURS]: 'hour(s)'
};
