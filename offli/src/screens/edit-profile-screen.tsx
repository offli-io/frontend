import React, { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import { useQueryClient } from '@tanstack/react-query'
import BackHeader from '../components/back-header'
import { IPersonExtended } from '../types/activities/activity.dto'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import ActionButton from '../components/action-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

interface IEditProfile {
  name: string
  aboutMe: string
  location: string
  birthDate: string
  instagramUsername: string
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    name: yup.string().defined().required('Please enter your name'),
    aboutMe: yup.string().defined().required('Please enter your aboutMe'),
    location: yup.string().defined().required('Please enter your location'),
    birthDate: yup.string().defined().required('Please enter your birthDate'),
    instagramUsername: yup
      .string()
      .defined()
      .required('Please enter your instagramUsername'),
  })

const EditProfileScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext)
  const queryClient = useQueryClient()

  const data = queryClient.getQueryData<{ data: IPersonExtended }>([
    'user-info',
    userInfo?.username,
  ])

  const navigate = useNavigate()

  const { control, handleSubmit, watch, setError, formState, reset } =
    useForm<IEditProfile>({
      defaultValues: {
        name: '',
        aboutMe: '',
        location: '',
        birthDate: '',
        instagramUsername: '',
      },
      resolver: yupResolver(schema()),
      mode: 'onChange',
    })

  useEffect(() => {
    // alebo setValue ak bude resetu kurovat
    reset({
      name: data?.data?.name,
      // aboutMe: data?.data?.name, // TODO: doplnit udaje na BE a pripojit FE
      aboutMe: 'Type something about you',
      location: 'Neporadza',
      birthDate: '1.1.1999',
      instagramUsername: 'staryjanotvojtatko',
    })
  }, [data])

  // console.log(formState?.errors)

  const handleFormSubmit = React.useCallback((values: IEditProfile) => {
    // queryClient.setQueryData(['registration-email-password'], values)
    // navigate(ApplicationLocations.PROFILE)
    console.log('Pakuj sa ty tlsta kacica')
  }, [])

  return (
    <>
      <BackHeader
        title="Edit profile"
        sx={{ mb: 2 }}
        to={ApplicationLocations.PROFILE}
      />
      <PageWrapper>
        <Box
          sx={{
            // mt: (HEADER_HEIGHT + 16) / 12,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <img
            onClick={() => console.log('asas')}
            // todo add default picture in case of missing photo
            src={data?.data?.profile_photo_url}
            alt="profile picture"
            style={{
              height: '70px',
              width: '70px',
              borderRadius: '50%',
              // border: '2px solid primary.main', //nejde pica
              border: '2px solid black',
            }}
          />
          <FormGroup sx={{ ml: 2, mt: 1 }}>
            <FormControlLabel control={<Checkbox />} label="Use default" />
          </FormGroup>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <Grid
              container
              rowSpacing={1.5}
              sx={{ width: '80%', mt: 1, fontSize: 5, alignItems: 'center' }}
            >
              <Grid item xs={5}>
                <Typography variant="h5">Name</Typography>
              </Grid>
              <Grid item xs={7}>
                {/* <Typography variant="h6">{data?.data?.name}</Typography> */}
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">About me</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="aboutMe"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      multiline
                      maxRows={4}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">Location</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5">Birthdate</Typography>
              </Grid>
              <Grid item xs={7}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">Instagram Username</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="instagramUsername"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <ActionButton type="submit" text="Save" sx={{ mt: 5 }} />
          </form>
          {/* <Button
          style={{
            width: '60%',
            borderRadius: '15px',
            backgroundColor: '#E4E3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2%',
            marginTop: '12%',
          }}
          onClick={saveChanges}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Save
          </Typography>
        </Button> */}
        </Box>
      </PageWrapper>
    </>
  )
}

export default EditProfileScreen
