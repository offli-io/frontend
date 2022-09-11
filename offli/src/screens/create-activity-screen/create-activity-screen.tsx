import React from 'react'
import { Box, useTheme } from '@mui/material'
import { PageWrapper } from '../../components/page-wrapper'
import { NameForm } from './components/name-form'
import { PlaceForm } from './components/place-form'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import OffliButton from '../../components/offli-button'

interface FormValues {
  name?: string
  place?: string
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
        ? yup.string().defined().required()
        : yup.string().notRequired(),
  })

const CreateActivityScreen = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState<number>(0)

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      place: '',
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
