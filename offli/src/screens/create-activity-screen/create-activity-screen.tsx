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
  ActivityPriceOptionsEnum,
  ActivityRepetitionOptionsEnum,
} from '../../types/common/types'
import { ActivityInviteForm } from './components/activity-invite-form'
import { ActivityDetailsForm } from './components/activity-details-form'
import { ActivityPhotoForm } from './components/activity-photo-form'
import { ActivityVisibilityEnum } from '../../types/activities/activity-visibility-enum.dto'

interface FormValues {
  name?: string
  description?: string
  location?: ILocation
  tags?: string[]
  //todo alter keys
  start_datetime?: Date
  end_datetime?: Date

  capacity?: number | null
  // public?: boolean
  repeated?: ActivityRepetitionOptionsEnum | string
  price?: ActivityPriceOptionsEnum | string
  title_picture?: string
  placeQuery?: string
  visibility?: ActivityVisibilityEnum
}

const schema: (activeStep: number) => yup.SchemaOf<FormValues> = (
  activeStep: number
) =>
  yup.object({
    name:
      activeStep === 0
        ? yup.string().defined().required()
        : yup.string().notRequired(),
    location:
      activeStep === 1
        ? yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required(),
              }),
            })
            .notRequired()
        : yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required(),
              }),
            })
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
    price:
      activeStep === 4
        ? yup
            .mixed<ActivityPriceOptionsEnum>()
            .oneOf(Object.values(ActivityPriceOptionsEnum))
            .defined()
            .required()
            .default(ActivityPriceOptionsEnum.free)
        : yup
            .mixed<ActivityPriceOptionsEnum>()
            .oneOf(Object.values(ActivityPriceOptionsEnum))
            .notRequired(),
    repeated:
      activeStep === 4
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
    placeQuery: yup.string().notRequired(),
    description: yup.string().notRequired(),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
  })

const CreateActivityScreen = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState<number>(0)

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      repeated: ActivityRepetitionOptionsEnum.never,
      price: ActivityPriceOptionsEnum.free,
      title_picture:
        'https://img.freepik.com/premium-vector/logo-emblem-person-playing-paintball-holds-two-guns-team-game-ammunition-shooting-range-war-vector-illustration_608021-991.jpg?w=2000',
    },
    resolver: yupResolver(schema(activeStep)),
    mode: 'onChange',
  })

  const { control, handleSubmit, formState, watch } = methods

  const handleFormSubmit = React.useCallback((data: FormValues) => {
    const { placeQuery, ...restValues } = data
    console.log(restValues)
  }, [])

  const handleFormError = React.useCallback(
    (error: any) => console.log(error),
    []
  )

  const renderProperContent = React.useCallback(() => {
    switch (activeStep) {
      case 0:
        return (
          <NameForm onNextClicked={() => setActiveStep(1)} methods={methods} />
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
          // <ActivityInviteForm
          //   onNextClicked={() => setActiveStep(1)}
          //   methods={methods}
          // />
          <ActivityDetailsForm
            onNextClicked={() => setActiveStep(activeStep => activeStep + 1)}
            methods={methods}
          />
        )
      case 5:
        return <ActivityPhotoForm methods={methods} />
      default:
        return (
          <Box>
            <OffliButton type="submit">Logni data</OffliButton>
          </Box>
        )
    }
  }, [activeStep, methods])

  const getFormLayout = React.useCallback(() => {
    switch (activeStep) {
      case 0:
        return 'center'
      case 1:
        return 'center'
      case 5:
        return 'space-evenly'
      default:
        return 'flex-start'
    }
  }, [activeStep])
  const centerContent = [0, 1].includes(activeStep)

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
          justifyContent: getFormLayout(),
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
