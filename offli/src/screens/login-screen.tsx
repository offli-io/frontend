import React from 'react'
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Logo from '../components/logo'
import { useMutation, useQuery } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import LabeledDivider from '../components/labeled-divider'
import { useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { loginRetrieveToken } from '../api/users/requests'

import axios from 'axios'
import { IEmailPassword } from '../types/users/user.dto'

export interface FormValues {
  email: string
  password: string
}

interface iXD {
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

  const { data, isLoading, mutate } = useMutation(
    ['token'],
    (values: FormValues) => loginRetrieveToken(values)
  )

  console.log(data?.data)

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const retrieveToken = ({ email, password }: IEmailPassword) =>
    useQuery(['token'], () =>
      axios.post('/login', { email, password }).then(res => res.data)
    )

  // const { data, status } = useQuery<IEmailPassword>(
  //   ['token'],
  //   retrieveToken(email, password)
  // )

  const handleFormSubmit = React.useCallback((values: FormValues) => {
    // const retrieveToken = useQuery(['token'], props => {
    //   loginRetrieveToken({
    //     // queryFunctionContext: props,
    //     postValues: { email: values.username, password: values.password }, ///FE ma username, BE ma email
    //   })
    // })
    // console.log(retrieveToken.status)
    mutate(values)
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
