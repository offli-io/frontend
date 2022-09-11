import React from 'react'
import { Box } from '@mui/material'
import { PageWrapper } from '../../components/page-wrapper'
import { NameForm } from './components/name-form'

const CreateActivityScreen = () => {
  const [activeStep, setActiveStep] = React.useState<number>(0)

  const renderProperContent = React.useCallback(() => {
    switch (activeStep) {
      case 0:
        return <NameForm />
      default:
        return <Box>final</Box>
    }
  }, [])

  return (
    <PageWrapper sxOverrides={{ alignItems: 'center', px: 3 }}>
      {renderProperContent()}
    </PageWrapper>
  )
}

export default CreateActivityScreen
