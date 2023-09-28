import { useQueryClient } from "@tanstack/react-query";
import { useActivities } from "hooks/use-activities";
import { useSnackbar } from "notistack";
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
  params: { limit = 2, participantId } = {},
  enabled,
}: IUseSendBuddyRequestProps = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const currentDate = React.useMemo(() => new Date(), []);

  const { data: { data: { activities = [] } = {} } = {}, isLoading } =
    useActivities<IActivityListRestDto>({
      params: {
        datetimeUntil: currentDate,
        sort: `${ActivitySortColumnEnum.DATETOME_UNTIL}:${ActivitySortDirectionEnum.DESC}` as any,
        limit,
        participantId,
      },
      enabled,
    });

  return { activities, isLoading };
};
