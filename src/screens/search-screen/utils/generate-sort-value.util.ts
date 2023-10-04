import {
  ActivitySortColumnEnum,
  ActivitySortDirectionEnum,
} from "types/activities/activity-sort-enum.dto";
import { RadioGroupDataDefinitionsEnum } from "./radio-group-data-definitions";

export const generateSortValue = (filterValue?: string) => {
  switch (filterValue) {
    case RadioGroupDataDefinitionsEnum.NEAREST:
      return `${ActivitySortColumnEnum.LOCATION}:${ActivitySortDirectionEnum.ASC}`;
    case RadioGroupDataDefinitionsEnum.CHEAPEST:
      return `${ActivitySortColumnEnum.PRICE}:${ActivitySortDirectionEnum.ASC}`;
    case RadioGroupDataDefinitionsEnum.HIGHEST_ATTENDANCE:
      return `${ActivitySortColumnEnum.COUNT_CONFIRMED}:${ActivitySortDirectionEnum.DESC}`;

    case RadioGroupDataDefinitionsEnum.CLOSEST_TIME:
      return `${ActivitySortColumnEnum.DATETIME_FROM}:${ActivitySortDirectionEnum.ASC}`;
    default:
      return undefined;
  }
};
