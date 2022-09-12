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

interface FormValues {
  name?: string
  place?: ILocation
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
  })

const CreateActivityScreen = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState<number>(0)

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema(activeStep)),
    mode: 'onChange',
  })

  const { control, handleSubmit, formState } = methods

  const handleFormSubmit = React.useCallback((data: FormValues) => {
    console.log(data)
  }, [])

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
      default:
        return (
          <Box>
            <OffliButton type="submit">Logni data</OffliButton>
          </Box>
        )
    }
  }, [activeStep, methods])

  return (
    <PageWrapper sxOverrides={{ alignItems: 'center', px: 3 }}>
      <form
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          //TODO in the future maybe include navigation height in the PageWrapper component for now pb: 12 is enough
          paddingBottom: theme.spacing(12),
          marginTop: theme.spacing(2),
        }}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {renderProperContent()}
      </form>
    </PageWrapper>
  )
}

export default CreateActivityScreen
