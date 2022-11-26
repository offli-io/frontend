import React from 'react'
import { Box, Typography, TextField, IconButton, Icon } from '@mui/material'
import BackButton from '../components/back-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import OffliButton from '../components/offli-button'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import {
  IEmailPassword,
  IEmailUsernamePassword,
  IUsername,
} from '../types/users/user.dto'
import {
  checkIfUsernameAlreadyTaken,
  preCreateUser,
} from '../api/users/requests'

const schema: () => yup.SchemaOf<IUsername> = () =>
  yup.object({
    username: yup.string().defined().required('Please enter your username'),
  })

const PickUsernamePhotoScreen = () => {
  const [username, setUsername] = React.useState<string>('')

  const { control, handleSubmit, setError, formState } = useForm<IUsername>({
    defaultValues: {
      username: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { data: usernameAlreadyTaken } = useQuery<any>(
    ['username-taken', username],
    () => checkIfUsernameAlreadyTaken(username),
    {
      enabled: !!username,
    }
  )

  const isUsernameInUse = Object.keys(formState?.errors)?.length !== 0

  const precreateUserMutation = useMutation(
    ['pre-created-user'],
    (values: IEmailUsernamePassword) => preCreateUser(values),
    {
      onSuccess: data => {
        console.log(data)
        navigate(ApplicationLocations.VERIFY)
      },
      onError: error => {
        console.log(error)
      },
    }
  )

  const handleFormSubmit = React.useCallback((values: IUsername) => {
    // if (usernameAlreadyTaken?.data) {
    //   setError('username', { message: 'Username already in use' })
    //   console.log(usernameAlreadyTaken?.data)
    //   return
    // }
    queryClient.setQueryData(['registration-username'], values)

    const registrationEmailPassword = queryClient.getQueryData<IEmailPassword>([
      'registration-email-password',
    ])

    precreateUserMutation.mutate({
      email: registrationEmailPassword?.email,
      username: values?.username,
      password: registrationEmailPassword?.password,
    })
  }, [])

  React.useEffect(() => {
    if (usernameAlreadyTaken?.data) {
      setError('username', { message: 'Username already in use' })
    }
  }, [usernameAlreadyTaken])

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
        <BackButton href={ApplicationLocations.REGISTER} text="Registration" />
        <Typography
          variant="h2"
          align="left"
          sx={{ mt: 15, width: '75%', flex: 2 }}
        >
          <Box sx={{ color: 'primary.main', width: '85%' }}>Choose&nbsp;</Box>
          your username
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
              error={!!error}
              helperText={error?.message}
              onBlur={event => {
                setUsername(event.target.value)
              }}
              sx={{ width: '80%', flex: 3 }}
            />
          )}
        />
        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            ml: -15,
          }}
        >
          <ErrorIcon sx={{ color: 'red', height: '18px' }} />
          <Typography variant="subtitle2" sx={{ color: 'red' }}>
            Username is taken!
          </Typography>
        </Box> */}
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: '80%', mb: 5 }}
          // disabled={usernameAlreadyTaken?.data}
        >
          Next
        </OffliButton>
      </Box>
    </form>
  )
}

export default PickUsernamePhotoScreen
