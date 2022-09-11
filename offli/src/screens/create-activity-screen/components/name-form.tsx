import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'

interface INameFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const NameForm: React.FC<INameFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState } = methods

  return (
    <>
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
          onClick={onNextClicked}
          sx={{ width: '80%' }}
          disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
