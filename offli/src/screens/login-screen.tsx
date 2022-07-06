import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
//import loadingImage from '../assets/img/loadingImg.jpg'
import Logo from '../components/logo'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import GoogleIcon from '@mui/icons-material/Google'
import LabeledDivider from '../components/labeled-divider'
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  )

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ height: '100%' }}
      className="backgroundImage"
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mt: 10 }}>
          <Logo />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            mt: -8,
          }}
        >
          <OffliButton
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Sign in with google
          </OffliButton>
          <LabeledDivider>
            <Typography>or</Typography>
          </LabeledDivider>
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
                sx={{ mb: 2, width: '70%' }}
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
                sx={{ mb: 3.5, width: '70%' }}
              />
            )}
          />
          <OffliButton sx={{ width: '70%' }} type="submit">
            Login
          </OffliButton>
          <OffliButton variant="text" sx={{ mt: 1 }}>
            <Typography variant="caption">Forgot your password?</Typography>
          </OffliButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography sx={{ color: 'white', mr: 2 }} variant="body1">
            Are you new?
          </Typography>
          <OffliButton
            sx={{ width: '35%' }}
            onClick={() => navigate('/register')}
          >
            Join now
          </OffliButton>
        </Box>
      </Box>
    </form>
  )
}

export default LoginScreen
