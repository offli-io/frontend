import React from 'react'
import { Box, Typography, TextField, IconButton, Icon } from '@mui/material'
import BackButton from '../components/back-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import OffliButton from '../components/offli-button'
import AddIcon from '@mui/icons-material/Add'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { IEmailPassword } from '../types/users/user.dto'
import { preCreateUser } from '../api/users/requests'

export interface IUsername {
  username: string
}

const schema: () => yup.SchemaOf<IUsername> = () =>
  yup.object({
    username: yup.string().defined().required(),
  })

const PickUsernamePhotoScreen = () => {
  const { control, handleSubmit } = useForm<IUsername>({
    defaultValues: {
      username: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { data, mutate: precreateUserMutate } = useMutation(
    ['pre-created-user'],
    (values: IEmailPassword) => preCreateUser(values),
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
    // queryClient.setQueryData(['registration-username-picture'], {
    //   username: values.username,
    //   profilePictureUrl: 'aa.com/bb',
    // })
    const precreatedEmailPassword = queryClient.getQueryData<IEmailPassword>([
      'registration-email-password',
    ])
    precreateUserMutate(precreatedEmailPassword!)
  }, [])

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
        <Typography variant="h2" align="left" sx={{ mt: 15, width: '75%' }}>
          <Box sx={{ color: 'primary.main', width: '85%' }}>Choose&nbsp;</Box>
          your username and profile picture
        </Typography>
        {/* <Box
          sx={{
            width: '100px',
            height: '100px',
            backgroundColor: 'lightgrey',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            mt: 7,
            mb: 7,
          }}
        > */}
        {/* <IconButton>
            <input accept="image/*" type="file" style={{ display: 'none' }} />

            <AddIcon sx={{ fontSize: 30, color: 'primary.main' }}></AddIcon>
          </IconButton> */}
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{ fontSize: '50px', mb: 9, mt: 7 }}
        >
          <AddAPhotoIcon sx={{ fontSize: '50px', color: 'lightgrey' }} />
          <input hidden accept="image/*" type="file" />
        </IconButton>
        {/* </Box> */}

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
        >
          Next
        </OffliButton>
      </Box>
    </form>
  )
}

export default PickUsernamePhotoScreen
