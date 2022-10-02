import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { format } from 'date-fns'
import TimePicker from '../../../components/time-picker'

interface IDateTimeForm {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const DateTimeForm: React.FC<IDateTimeForm> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState, watch, setValue } = methods

  const handleTimeChange = React.useCallback(
    (type: 'start_datetime' | 'end_datetime', value: string | null) => {
      if (value) {
        const timeSplit = value.split(':')
        const currentStartDate = watch('start_datetime')
        const date = new Date(currentStartDate)
        date.setHours(Number(timeSplit[0]), Number(timeSplit[1]), 0)

        console.log(date)
        setValue(type, date)
      }
    },
    [setValue, watch]
  )

  const isFormValid = !!watch('start_datetime') && !!watch('end_datetime')

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
          name="start_datetime"
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
              minDate={new Date()}
              label="Date"
              inputFormat="dd.MM.yyyy"
              renderInput={(params: any) => <TextField {...params} />}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TimePicker
          label="From"
          sx={{ width: '40%', mr: 2 }}
          onChange={(value: string | null) =>
            handleTimeChange('start_datetime', value)
          }
        />
        <Typography sx={{ fontWeight: 200, fontSize: '2rem', pb: 1.5 }}>
          -
        </Typography>

        <TimePicker
          label="To"
          sx={{ width: '40%', ml: 2 }}
          onChange={(value: string | null) =>
            handleTimeChange('end_datetime', value)
          }
        />
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '80%' }}
          disabled={!isFormValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
