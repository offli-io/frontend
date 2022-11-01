import React from 'react'
import { Box, useTheme } from '@mui/material'
import { PageWrapper } from '../../components/page-wrapper'
import { NameForm } from './components/name-form'
import { PlaceForm } from './components/place-form'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import OffliButton from '../../components/offli-button'
import { ILocation } from '../../types/activities/location.dto'
import { ActivityTypeForm } from './components/activity-type-form'
import { DateTimeForm } from './components/date-time-form'
import {
  ActivityFeesOptionsEnum,
  ActivityRepetitionOptionsEnum,
} from '../../types/common/types'
import { ActivityInviteForm } from './components/activity-invite-form'
import { ActivityDetailsForm } from './components/activity-details-form'
import { ActivityPhotoForm } from './components/activity-photo-form'

interface FormValues {
  name?: string
  place?: ILocation
  tags?: string[]
  //todo alter keys
  start_datetime?: Date
  end_datetime?: Date
  fee?: string
  capacity?: number | null
  // public?: boolean
  repeated?: ActivityRepetitionOptionsEnum
  title_picture?: string
}

const schema: (activeStep: number) => yup.SchemaOf<FormValues> = (
  activeStep: number
) =>
  yup.object({
    name:
      activeStep === 0
        ? yup.string().defined().required()
        : yup.string().notRequired(),
    place:
      activeStep === 1
        ? yup
            .object({
              type: yup.string().defined().required(),
              id: yup.number().defined().required(),
              lat: yup.number().defined().required(),
              lon: yup.number().defined().required(),
              tags: yup.object({
                city_limit: yup.string().defined().required(),
                name: yup.string().defined().required(),
                traffic_sign: yup.string().defined().required(),
              }),
            })
            .defined()
            .required()
        : yup
            .object({
              type: yup.string().notRequired(),
              id: yup.number().notRequired(),
              lat: yup.number().notRequired(),
              lon: yup.number().notRequired(),
              tags: yup.object({
                city_limit: yup.string().notRequired(),
                name: yup.string().notRequired(),
                traffic_sign: yup.string().notRequired(),
              }),
            })
            .notRequired(),
    fee:
      activeStep === 1
        ? yup
            .mixed<ActivityFeesOptionsEnum>()
            .oneOf(Object.values(ActivityFeesOptionsEnum))
            .defined()
            .required()
        : yup
            .mixed<ActivityFeesOptionsEnum>()
            .oneOf(Object.values(ActivityFeesOptionsEnum))
            .notRequired(),
    tags:
      activeStep === 2
        ? yup.array().of(yup.string()).defined().required()
        : yup.array().of(yup.string()).notRequired(),
    start_datetime:
      activeStep === 3
        ? yup
            .date()
            .defined()
            .required()
            .default(() => new Date())
        : yup.date().notRequired(),
    end_datetime:
      activeStep === 3
        ? yup.date().defined().required()
        : yup.date().notRequired(),
    repeated:
      activeStep === 3
        ? yup
            .mixed<ActivityRepetitionOptionsEnum>()
            .oneOf(Object.values(ActivityRepetitionOptionsEnum))
            .defined()
            .required()
            .default(ActivityRepetitionOptionsEnum.never)
        : yup
            .mixed<ActivityRepetitionOptionsEnum>()
            .oneOf(Object.values(ActivityRepetitionOptionsEnum))
            .notRequired(),
    capacity: yup.number().nullable().notRequired().default(null),
    title_picture: yup.string().notRequired(),
  })

const CreateActivityScreen = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState<number>(0)

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      repeated: ActivityRepetitionOptionsEnum.never,
      fee: 'free',
    },
    resolver: yupResolver(schema(activeStep)),
    mode: 'onChange',
  })

  const { control, handleSubmit, formState } = methods

  const handleFormSubmit = React.useCallback((data: FormValues) => {
    console.log(data)
  }, [])

  const handleFormError = React.useCallback(
    (error: any) => console.log(error),
    []
  )

  const renderProperContent = React.useCallback(() => {
    switch (activeStep) {
      case 0:
        return (
          <ActivityPhotoForm
            onNextClicked={() => setActiveStep(1)}
            methods={methods}
          />
        )
      case 1:
        return (
          <PlaceForm
            onNextClicked={() => setActiveStep(activeStep => activeStep + 1)}
            methods={methods}
          />
        )
      case 2:
        return (
          <ActivityTypeForm
            onNextClicked={() => setActiveStep(activeStep => activeStep + 1)}
            methods={methods}
          />
        )
      case 3:
        return (
          <DateTimeForm
            onNextClicked={() => setActiveStep(activeStep => activeStep + 1)}
            methods={methods}
          />
        )
      case 4:
        return (
          <ActivityInviteForm
            onNextClicked={() => setActiveStep(1)}
            methods={methods}
          />
        )
      case 5:
        return (
          <ActivityDetailsForm
            onNextClicked={() => setActiveStep(1)}
            methods={methods}
          />
        )
      default:
        return (
          <Box>
            <OffliButton type="submit">Logni data</OffliButton>
          </Box>
        )
    }
  }, [activeStep, methods])

  const centerContent = [1].includes(activeStep)

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      //behavior: '',
    })
  }, [activeStep])

  return (
    <PageWrapper sxOverrides={{ alignItems: 'center', px: 3 }}>
      <form
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: centerContent ? 'center' : 'flex-start',
          flexDirection: 'column',
          height: '72vh',
          width: '100%',
          //TODO in the future maybe include navigation height in the PageWrapper component for now pb: 12 is enough
          paddingBottom: theme.spacing(20),
          marginTop: theme.spacing(2),
        }}
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      >
        {renderProperContent()}
      </form>
    </PageWrapper>
  )
}

export default CreateActivityScreen
