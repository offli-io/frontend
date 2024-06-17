import { ActivityDurationTypeEnumDto } from 'types/activities/activity-duration-type-enum.dto';
import { ActivityVisibilityEnum } from 'types/activities/activity-visibility-enum.dto';
import { ILocation } from 'types/activities/location.dto';
import * as yup from 'yup';

export interface FormValues {
  title?: string;
  description?: string;
  location?: ILocation | null;
  tags?: string[];
  //todo alter keys
  datetime_from?: Date;
  datetime_until?: Date;
  // public?: boolean
  //repeated?: ActivityRepetitionOptionsEnum | string
  price?: number | null;
  title_picture?: string;
  placeQuery?: string;
  visibility?: ActivityVisibilityEnum;
  limit?: number;
  isActivityFree?: boolean;
  timeFrom?: string | null;
  duration?: number;
  durationType?: ActivityDurationTypeEnumDto;
}

export const validationSchema: (activeStep: number) => yup.SchemaOf<FormValues> = (
  activeStep: number
) =>
  yup.object({
    title: activeStep === 0 ? yup.string().defined().required() : yup.string().notRequired(),
    location:
      activeStep === 1
        ? yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required()
              })
            })
            .notRequired()
        : yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required()
              })
            })
            .nullable(true)
            .notRequired(),

    tags:
      activeStep === 2
        ? yup.array().of(yup.string()).defined().required()
        : yup.array().of(yup.string()).notRequired(),
    datetime_from: activeStep === 3 ? yup.date().defined().required() : yup.date().notRequired(),
    datetime_until: activeStep === 3 ? yup.date().defined().required() : yup.date().notRequired(),
    price:
      activeStep === 4
        ? yup
            .number()
            .min(0)
            .when('isActivityFree', {
              is: (isActivityFree?: boolean) => !!isActivityFree,
              then: (schema) => schema.notRequired(),
              otherwise: (schema) => schema.defined().required()
            })
            .typeError("Price must be a number. Check 'free' or leave empty for free price")
        : yup.number().notRequired().nullable(true),
    limit: activeStep === 4 ? yup.number().min(0).required().defined() : yup.number().notRequired(),
    title_picture: yup.string().notRequired(),
    placeQuery: yup.string().notRequired(),
    description: yup.string().notRequired(),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
    isActivityFree: yup.bool().notRequired(),
    timeFrom:
      activeStep === 3
        ? yup.string().defined().required().nullable(true)
        : yup.string().notRequired().nullable(true),
    duration: activeStep === 3 ? yup.number().defined().required() : yup.number().notRequired(),
    durationType:
      activeStep === 3
        ? yup
            .mixed<ActivityDurationTypeEnumDto>()
            .oneOf(Object.values(ActivityDurationTypeEnumDto))
            .defined()
            .required()
        : yup
            .mixed<ActivityDurationTypeEnumDto>()
            .oneOf(Object.values(ActivityDurationTypeEnumDto))
            .notRequired()
  });
