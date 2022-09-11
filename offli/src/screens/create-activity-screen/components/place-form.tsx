import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'

interface IPlaceFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const PlaceForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, handleSubmit, formState } = methods

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Add</Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          place
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Controller
          name="place"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              variant="standard"
              error={!!error}
              sx={{ width: '80%' }}
              helperText={!!error && 'Activity place is required'}
              //label="Username"
              // disabled={methodSelectionDisabled}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <FormControlLabel control={<Checkbox />} label="Private activity" />
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
