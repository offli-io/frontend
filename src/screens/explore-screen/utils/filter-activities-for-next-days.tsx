import { addDays, isWithinInterval, startOfToday } from 'date-fns';
import { IActivity } from 'types/activities/activity.dto';

export function filterActivitiesForNext7Days(activities: IActivity[]) {
  const today = startOfToday();
  const next7Days = addDays(today, 8);

  return activities.filter((activity) => {
    if (activity?.datetime_from) {
      const startDate = new Date(activity.datetime_from);

      return isWithinInterval(startDate, { start: today, end: next7Days });
    }
    return false;
  });
}
