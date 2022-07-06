import React from 'react'
import {
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import OffliButton from '../components/offli-button'
import GoogleIcon from '@mui/icons-material/Google'

import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
export interface FormValues {
  email: string
  password: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    email: yup.string().email().defined().required(),
    password: yup.string().defined().required(),
  })

export const RegistrationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [usernameValid] = React.useState(true)

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: '',
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
    <form
      onSubmit={handleSubmit(handleFormSubmit, (data, e) =>
        console.log(data, e)
      )}
      className="backgroundImage"
    >
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
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            mt: 6,
            fontSize: '38px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          Start live <Box sx={{ color: 'primary.main' }}>&nbsp;offline.</Box>
        </Typography>
        <OffliButton
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mt: 3, mb: 2, width: '70%' }}
        >
          Sign in with google
        </OffliButton>
        <Divider
          variant="middle"
          sx={{
            width: '80%',
            '&::before, &::after': {
              borderColor: 'black',
            },
            mb: 2,
            textAlign: 'center',
          }}
        >
          or
        </Divider>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          Sign up & enjoy life together
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              //   label="Username"
              placeholder="Email"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ mb: 2, width: '70%' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {usernameValid ? (
                        <CheckCircleIcon />
                      ) : (
                        <RemoveCircleIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              type={showPassword ? 'text' : 'password'}
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ width: '70%' }}
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
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ color: 'lightgrey', fontSize: '12px', width: '70%', mt: 2 }}
        >
          By signing up, you agree to the terms of the <br />
          Offli <b>Privacy Policy</b> and <b>Cookie Policy</b>.
        </Typography>
        <OffliButton type="submit" sx={{ width: '70%', mt: 2 }}>
          Next
        </OffliButton>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
          }}
        >
          <Typography sx={{ color: 'white' }}>Already using Offli?</Typography>
          <OffliButton sx={{ ml: 1 }}>Login</OffliButton>
        </div>
      </Box>
    </form>
  )
}

export default RegistrationScreen
