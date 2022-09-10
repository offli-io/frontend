import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
//import loadingImage from '../assets/img/loadingImg.jpg'
import Logo from '../components/logo'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
//import GoogleIcon from '@mui/icons-material/Google'
import LabeledDivider from '../components/labeled-divider'
import { useNavigate } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
// import {
//   GoogleLogin,
//   GoogleLoginResponse,
//   GoogleLoginResponseOffline,
// } from 'react-google-login'
import { CLIENT_ID } from '../utils/common-constants'

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

  // const handleSuccessfullLogin = React.useCallback(
  //   (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  //     //or if((res as GoogleLoginResponse).profileObj)
  //     if ('profileObj' in res) {
  //       console.log('[Login Success] current user : ', res.profileObj)
  //       refreshTokenSetup(res)
  //     } else {
  //       return
  //       //TODO handle GoogleLoginResponseOffline
  //     }
  //   },
  //   []
  // )

  // const handleFailedLogin = React.useCallback((res: GoogleLoginResponse) => {
  //   console.log('[Login Failed] res : ', res)
  // }, [])

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ height: '100%' }}
      // className="backgroundImage"
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
          <Box id="signIn"></Box>

          <LabeledDivider sx={{ my: 1 }}>
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
                // disabled={methodSelectionDisabled}
                sx={{ width: '80%' }}
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
                sx={{ width: '80%' }}
              />
            )}
          />

          <OffliButton variant="text" sx={{ mt: 1 }}>
            <Typography variant="caption">Forgot your password?</Typography>
          </OffliButton>
        </Box>
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
          }}
        ></Box> */}
        <OffliButton sx={{ width: '80%', mb: 5 }} type="submit">
          Login
        </OffliButton>
      </Box>
    </form>
  )
}

export default LoginScreen
