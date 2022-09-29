import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

interface IDateTimeForm {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const DateTimeForm: React.FC<IDateTimeForm> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState } = methods

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Select</Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          date
        </Typography>
        <Typography variant="h4" sx={{ ml: 1 }}>
          and
        </Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          time
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Controller
          name="startD"
          control={control}
          render={({ field, fieldState: { error } }) => (
            // <TextField
            //   autoFocus
            //   {...field}
            //   variant="standard"
            //   error={!!error}
            //   sx={{ width: '80%' }}
            //   helperText={!!error && 'Activity name is required'}
            //   //label="Username"
            //   // disabled={methodSelectionDisabled}
            // />
            <MobileDatePicker
              {...field}
              label="Date mobile"
              inputFormat="MM/DD/YYYY"
              renderInput={(params: any) => <TextField {...params} />}
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
