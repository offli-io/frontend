import React from 'react'
import { Box, Divider, TextField } from '@mui/material'
//import loadingImage from '../assets/img/loadingImg.jpg'
import Logo from '../components/logo'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import GoogleIcon from '@mui/icons-material/Google'

//const logo = require('../assets/img/logoPurple.png')

// interface ILoginScreenProps {}
export interface FormValues {
  username: string
  password: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
    password: yup.string().defined().required(),
  })

const LoginScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo />
        <OffliButton
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mb: 4 }}
        >
          Sign in with google
        </OffliButton>
        <Divider
          variant="middle"
          sx={{
            width: '90%',
            '&::before, &::after': {
              borderColor: 'black',
            },
            mb: 2,
            textAlign: 'center',
          }}
        >
          or
        </Divider>
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
              sx={{ mb: 4 }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              //label="Username"
              placeholder="Password"
              type="password"
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
            />
          )}
        />
      </Box>
    </form>
  )
}

export default LoginScreen
