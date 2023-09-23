import { ActivityDurationTypeEnumDto } from "types/activities/activity-duration-type-enum.dto";
import { ActivityVisibilityEnum } from "types/activities/activity-visibility-enum.dto";
import * as yup from "yup";

export interface IAdditionalHelperActivityInterface {
  placeQuery?: string;
  durationType?: ActivityDurationTypeEnumDto;
  timeFrom?: string;
  duration?: number;
  isActivityFree?: boolean;
}

export const validationSchema = () =>
  yup.object({
    title: yup.string().defined().required(),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup.object({
          lat: yup.number().defined().required(),
          lon: yup.number().defined().required(),
        }),
      })
      .notRequired(),

    tags: yup.array().of(yup.string()).defined().required(),
    datetime_from: yup.date().defined().required(),
    datetime_until: yup.date().defined().required(),
    price: yup
      .number()
      .when("isActivityFree", {
        is: (isActivityFree?: boolean) => !!isActivityFree,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.defined().required(),
      })
      .typeError(
        "Price must be a number. Check 'free' or leave empty for free price"
      ),
    limit: yup.number().required().defined(),
    title_picture: yup.string().notRequired(),
    placeQuery: yup.string().notRequired(),
    description: yup.string().notRequired(),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
    isActivityFree: yup.bool().notRequired(),
  });
