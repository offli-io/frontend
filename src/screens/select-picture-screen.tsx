import React from 'react'
import { Box, Typography, TextField, IconButton } from '@mui/material'
import BackButton from '../components/back-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { ApplicationLocations } from '../types/common/applications-locations.dto'

export interface FormValues {
  username: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
  })

const SelectProfilePictureScreen = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ height: '100%' }}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          //   justifyContent: 'center',
        }}
      >
        {/* <BackButton href={ApplicationLocations.REGISTER} text="Registration" /> */}
        <Typography variant="h2" sx={{ mt: 15, display: 'flex', flex: 1 }}>
          Select your
          <Box sx={{ color: 'primary.main' }}>&nbsp;profile picture</Box>
        </Typography>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{ fontSize: '50px', mb: 25 }}
        >
          <AddAPhotoIcon sx={{ fontSize: '50px', color: 'lightgrey' }} />
          <input hidden accept="image/*" type="file" />
        </IconButton>
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: '80%', mb: 1 }}
        >
          Next
        </OffliButton>
        <OffliButton variant="text" sx={{ width: '80%', mb: 5 }}>
          Skip
        </OffliButton>
      </Box>
    </form>
  )
}

export default SelectProfilePictureScreen
