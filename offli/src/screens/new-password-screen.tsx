import React from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import BackButton from '../components/back-button'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import OffliButton from '../components/offli-button'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
// import ErrorIcon from '@mui/icons-material/Error'
import { ApplicationLocations } from '../types/common/applications-locations.dto'

export interface FormValues {
  password: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    password: yup.string().defined().required(),
  })

const NewPasswordScreen = () => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
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
        className="backgroundImage"
      >
        <BackButton href={ApplicationLocations.VERIFY} text="Verification" />
        <Typography
          variant="h3"
          sx={{ mt: 20, mb: 4, fontWeight: 'bold', fontSize: '24px' }}
        >
          New password
        </Typography>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ mb: 4, width: '70%' }}
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
        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, ml: -15 }}>
          <ErrorIcon sx={{ color: 'red', height: '18px' }} />
          <Typography variant="subtitle2" sx={{ color: 'red' }}>
            Username is taken!
          </Typography>
        </Box> */}
        <OffliButton variant="contained" type="submit" sx={{ width: '70%' }}>
          Reset password
        </OffliButton>
      </Box>
    </form>
  )
}

export default NewPasswordScreen
