import React from 'react'
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Logo from '../components/logo'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import LabeledDivider from '../components/labeled-divider'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { loginRetrieveToken } from '../api/users/requests'

export interface FormValues {
  email: string
  password: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    email: yup.string().defined().required(),
    password: yup.string().defined().required(),
  })

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)

  const { data, mutate } = useMutation(['token'], (values: FormValues) =>
    loginRetrieveToken(values)
  )

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const handleFormSubmit = React.useCallback((values: FormValues) => {
    mutate(values)
    console.log(data?.status)
  }, [])

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
            <Typography variant="subtitle1">alebo</Typography>
          </LabeledDivider>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                autoFocus
                {...field}
                //label="Username"
                placeholder="Meno, email alebo mobil"
                // variant="filled"
                error={!!error}
                // helperText={
                //   error?.message ||
                //   t(`value.${nextStep?.authenticationType}.placeholder`)
                // }
                // disabled={methodSelectionDisabled}
                sx={{ width: '80%', mb: 2 }}
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
                placeholder="Heslo"
                type={showPassword ? 'text' : 'password'}
                // variant="filled"
                error={!!error}
                // helperText={
                //   error?.message ||
                //   t(`value.${nextStep?.authenticationType}.placeholder`)
                // }
                //disabled={methodSelectionDisabled}
                sx={{ width: '80%' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <OffliButton variant="text">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 'bold', ml: '-70%' }}
            >
              Forgot your password?
            </Typography>
          </OffliButton>
        </Box>
        <OffliButton sx={{ width: '80%', mb: 5 }} type="submit">
          Login
        </OffliButton>
      </Box>
    </form>
  )
}

export default LoginScreen
