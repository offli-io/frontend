import { ActivityDurationTypeEnumDto } from "types/activities/activity-duration-type-enum.dto";
import { ActivityVisibilityEnum } from "types/activities/activity-visibility-enum.dto";
import * as yup from "yup";
import { isBefore } from "date-fns";

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
    datetime_until: yup
      .date()
      .defined()
      .required()
      .test(
        "date-before",
        "End datetime can't be before start datetime",
        function (value) {
          if (value && this.parent.datetime_from) {
            return !isBefore(value, this.parent.datetime_from);
          }
          return true;
        }
      ),
    price: yup
      .number()
      .when("isActivityFree", {
        is: (isActivityFree?: boolean) => !!isActivityFree,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.defined().required(),
      })
      .typeError("Price must be filled. Type '0' for free price"),
    limit: yup
      .number()
      .required()
      .defined()
      .typeError("Activity maximal attendance must be filled"),
    title_picture: yup.string().notRequired(),
    placeQuery: yup.string().notRequired(),
    description: yup.string().notRequired(),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
    isActivityFree: yup.bool().notRequired(),
  });
