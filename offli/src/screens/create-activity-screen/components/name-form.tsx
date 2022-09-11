import { Box, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import OffliButton from '../../../components/offli-button'

interface FormValues {
  name: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    name: yup.string().defined().required(),
  })

export const NameForm: React.FC = () => {
  const theme = useTheme()

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const handleFormSubmit = React.useCallback((data: FormValues) => {
    console.log(data)
  }, [])

  return (
    <form
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        //TODO in the future maybe include navigation height in the PageWrapper component for now pb: 12 is enough
        paddingBottom: theme.spacing(12),
        marginTop: theme.spacing(2),
      }}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Create</Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          name
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              variant="standard"
              error={!!error}
              sx={{ width: '80%' }}
              helperText={!!error && 'Activity name is required'}
              //label="Username"
              // disabled={methodSelectionDisabled}
            />
          )}
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <OffliButton
          type="submit"
          sx={{ width: '50%' }}
          disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </form>
  )
}
