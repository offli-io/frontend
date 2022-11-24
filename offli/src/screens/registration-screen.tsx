import React from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import OffliButton from '../components/offli-button'
import GoogleIcon from '@mui/icons-material/Google'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import LabeledDivider from '../components/labeled-divider'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { checkIfEmailAlreadyTaken, preCreateUser } from '../api/users/requests'

import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { IEmailPassword } from '../types/users/user.dto'

const schema: () => yup.SchemaOf<IEmailPassword> = () =>
  yup.object({
    email: yup.string().email().defined().required(),
    password: yup.string().defined().required('Please enter your password'),
    //   .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    // ),
  })

export const RegistrationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [usernameValid] = React.useState(true)
  const [email, setEmail] = React.useState<string | undefined>()

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const {
    status,
    error,
    data: emailAlreadyTaken,
  } = useQuery(['email-taken', email], () => checkIfEmailAlreadyTaken(email), {
    enabled: !!email,
  })

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const { control, handleSubmit, watch, setError, getFieldState } =
    useForm<IEmailPassword>({
      defaultValues: {
        email: '',
        password: '',
      },
      resolver: yupResolver(schema()),
      mode: 'onChange',
    })

  const handleFormSubmit = React.useCallback((values: IEmailPassword) => {
    queryClient.setQueryData(['registration-email-password'], values)
    navigate(ApplicationLocations.PICK_USERNAME)
    // console.log(data?.data)
  }, [])

  React.useEffect(() => {
    if (emailAlreadyTaken?.data) {
      setError('email', { message: 'Email already in use' })
    }
  }, [emailAlreadyTaken])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            mt: 10,
            display: 'flex',
            flex: 1,
          }}
        >
          Start live
          <Box sx={{ color: 'primary.main', fontSize: 'bold' }}>
            &nbsp;offline.
          </Box>
        </Typography>
        <Box
          sx={{
            mb: 1,
          }}
          id="signIn"
        ></Box>

        <LabeledDivider>
          <Typography variant="subtitle1">alebo</Typography>
        </LabeledDivider>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontSize: 18,
          }}
        >
          Sign up & enjoy life together
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            flex: 3,
          }}
        >
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
                helperText={error?.message}
                //disabled={methodSelectionDisabled}
                sx={{ width: '80%', mb: 2 }}
                onBlur={event => setEmail(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        {usernameValid ? (
                          <CheckCircleIcon sx={{ color: 'lightgrey' }} />
                        ) : (
                          <RemoveCircleIcon sx={{ color: 'lightgrey' }} />
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
                helperText={error?.message}
                //disabled={methodSelectionDisabled}
                sx={{ width: '80%' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? (
                          <VisibilityIcon sx={{ color: 'lightgrey' }} />
                        ) : (
                          <VisibilityOffIcon sx={{ color: 'lightgrey' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: 'lightgrey',
              mt: 2,
              lineHeight: 1.2,
            }}
          >
            By signing up, you agree to the terms of the <br />
            Offli <b>Privacy Policy</b> and <b>Cookie Policy</b>.
          </Typography>
        </Box>

        <OffliButton type="submit" sx={{ width: '70%', mb: 5 }}>
          Next
        </OffliButton>
      </Box>
    </form>
  )
}

export default RegistrationScreen
