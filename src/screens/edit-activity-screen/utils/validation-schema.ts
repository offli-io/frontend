import * as yup from "yup";
import { ActivityVisibilityEnum } from "../../../types/activities/activity-visibility-enum.dto";
import { ActivityPriceOptionsEnum } from "../../../types/common/types";
import { FormValues } from "../edit-activity-screen";

export const editActivitySchema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    title: yup.string().defined().required("Please enter the Title"),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup.object({
          lat: yup.number().defined().required(),
          lon: yup.number().defined().required(),
        }),
      })
      .required(),
    datetime_from: yup
      .date()
      .defined()
      .required("Please enter the Start Date")
      .default(() => new Date()),
    datetime_until: yup
      .date()
      .defined()
      .required("Please enter the End Date")
      .default(() => new Date()),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
    limit: yup.number().required("Please enter the Max Attendance").defined(),
    price: yup
      .mixed<ActivityPriceOptionsEnum>()
      .oneOf(Object.values(ActivityPriceOptionsEnum))
      .defined()
      .required("Please enter the Price")
      .default(ActivityPriceOptionsEnum.free),
    description: yup
      .string()
      .defined()
      .required("Please enter the Description"),
    placeQuery: yup.string().notRequired(),
  });
