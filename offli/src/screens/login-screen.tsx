import React from 'react'
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import qs from 'qs'
import Logo from '../components/logo'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import LabeledDivider from '../components/labeled-divider'
import { useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useKeycloak } from '@react-keycloak/web'
import axios from 'axios'
import {
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from '../utils/token.util'

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
  const { keycloak, initialized } = useKeycloak()
  const [showPassword, setShowPassword] = React.useState(false)

  const query = useQuery(['users'], () => axios.get('/users'), {
    enabled: false,
  })
  // const { data, mutate } = useMutation(['token'], (values: FormValues) =>
  //   loginRetrieveToken(values)
  // )

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
    // mutate(values)
    //keycloak.login()
    mut.mutate()
    console.log(getAuthToken())
  }, [])

  const keycloakinfo = useQuery(['keycloak-data'], () =>
    axios.get(
      'http://localhost:8082/realms/Offli/.well-known/openid-configuration'
    )
  )

  const mut = useMutation(
    ['keycloak-login'],
    () => {
      const data = {
        username: 'fme',
        password: 'test',
        grant_type: 'password',
        client_id: 'UserManagement',
      }
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'http://localhost:8082/realms/Offli/protocol/openid-connect/token',
      }
      return axios(options)
      // const params = new URLSearchParams()
      // params.append('username', 'fme')
      // params.append('password', 'test')
      // params.append('grant_type', 'password')
      // params.append('client_id', 'UserManagement')
      // return axios.post(
      //   'http://localhost:8082/realms/Offli/protocol/openid-connect/token',
      //   params,
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   }
      // )
    },
    {
      onSuccess: data => {
        console.log(data?.data)
        setAuthToken(data?.data?.access_token)
        setRefreshToken(data?.data?.refresh_token)
        query?.refetch()
      },
    }
  )

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
