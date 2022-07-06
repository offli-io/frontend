import React from 'react'
import { Box, Typography, TextField } from '@mui/material'
import BackButton from '../components/back-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import ErrorIcon from '@mui/icons-material/Error'

export interface FormValues {
  username: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
  })

const PickUsernameScreen = () => {
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
        className="backgroundImage"
      >
        <BackButton href="/register" text="Registration" />
        <Typography
          variant="h3"
          sx={{ mt: 20, mb: 4, fontWeight: 'bold', fontSize: '24px' }}
        >
          Pick your username
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              //label="Username"
              placeholder="Username"
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ mb: 1, width: '70%' }}
            />
          )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, ml: -15 }}>
          <ErrorIcon sx={{ color: 'red', height: '18px' }} />
          <Typography variant="subtitle2" sx={{ color: 'red' }}>
            Username is taken!
          </Typography>
        </Box>
        <OffliButton variant="contained" type="submit" sx={{ width: '70%' }}>
          Next
        </OffliButton>
      </Box>
    </form>
  )
}

export default PickUsernameScreen
