import { useActivities } from "hooks/use-activities";
import React from "react";
import { IActivitiesParamsDto } from "types/activities/activities-params.dto";
import { IActivityListRestDto } from "types/activities/activity-list-rest.dto";
import {
  ActivitySortColumnEnum,
  ActivitySortDirectionEnum,
} from "types/activities/activity-sort-enum.dto";

interface IUseSendBuddyRequestProps {
  params?: IActivitiesParamsDto;
  enabled?: boolean;
}

export const useGetLastAttendedActivities = ({
  params: { limit = 2, participantId, ...rest } = {},
  enabled,
}: IUseSendBuddyRequestProps = {}) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const currentDate = React.useMemo(() => new Date(), []);

  const { data: { data: { activities = [] } = {} } = {}, isLoading } =
    useActivities<IActivityListRestDto>({
      params: {
        datetimeUntil: currentDate,
        sort: `${ActivitySortColumnEnum.DATETOME_UNTIL}:${ActivitySortDirectionEnum.DESC}` as any,
        limit,
        participantId,
        ...rest,
      },
      enabled,
    });

  return { activities, isLoading };
};
