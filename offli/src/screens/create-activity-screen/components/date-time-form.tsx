import { Box, MenuItem, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { format } from 'date-fns'
import TimePicker from '../../../components/time-picker'
import { ActivityRepetitionOptionsEnum } from '../../../types/common/types'

interface IDateTimeForm {
  onNextClicked: () => void
  methods: UseFormReturn
}

const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
      index % 2 === 0 ? '00' : '30'
    }`
)

export const DateTimeForm: React.FC<IDateTimeForm> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState, watch, setValue } = methods
  const currentStartDate = watch('start_datetime')
  const currentEndDate = watch('end_datetime')

  const handleTimeChange = React.useCallback(
    (type: 'start_datetime' | 'end_datetime', value: string | null) => {
      if (value) {
        const timeSplit = value.split(':')
        const date = currentStartDate ? new Date(currentStartDate) : new Date()
        date.setHours(Number(timeSplit[0]), Number(timeSplit[1]), 0)

        setValue(type, date)
      }
    },
    [setValue, watch]
  )

  const isFormValid = !!watch('start_datetime') && !!watch('end_datetime')

  const getFromDisabledOptions = (option: string) => {
    const toTime = !!currentEndDate && format(currentEndDate, 'hh:mm')
    if (toTime) {
      if (option > toTime) {
        return true
      }
    }
    return false
  }

  const getToDisabledOptions = (option: string) => {
    const fromTime = !!currentStartDate && format(currentStartDate, 'hh:mm')
    if (fromTime) {
      if (option < fromTime) {
        return true
      }
    }
    return false
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Controller
            name="start_datetime"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MobileDatePicker
                {...field}
                closeOnSelect
                // componentProps={{
                //   actionBar: undefined,
                // }}
                minDate={new Date()}
                label="Date"
                inputFormat="dd.MM.yyyy"
                renderInput={(params: any) => <TextField {...params} />}
              />
            )}
          />
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <TimePicker
              label="From"
              sx={{ width: '40%', mr: 2 }}
              onChange={(value: string | null) =>
                handleTimeChange('start_datetime', value)
              }
              options={timeSlots}
              getOptionDisabled={getFromDisabledOptions}
            />
            <Typography sx={{ fontWeight: 200, fontSize: '2rem' }}>
              -
            </Typography>

            <TimePicker
              label="To"
              sx={{ width: '40%', ml: 2 }}
              onChange={(value: string | null) =>
                handleTimeChange('end_datetime', value)
              }
              options={timeSlots}
              getOptionDisabled={getToDisabledOptions}
            />
          </Box>
        </Box>
        {/* <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Does activity repeat?
          </Typography>
          <Controller
            name="repeated"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                id="outlined-select-currency"
                select
                label="Select"
                sx={{ width: '60%' }}
                // helperText="Please select your currency"
              >
                {Object.values(ActivityRepetitionOptionsEnum).map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box> */}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%' }}
          disabled={!isFormValid}
        >
          Next
        </OffliButton>
      </Box>
    </Box>
  )
}
