import { Box, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { format } from 'date-fns'
import TimePicker from '../../../components/time-picker'
import { ActivityRepetitionOptionsEnum } from '../../../types/common/types'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { getNearestTime } from '../../../utils/nearest-tine.util'

interface IDateTimeForm {
  onNextClicked: () => void

  onBackClicked: () => void
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
  onBackClicked,
  methods,
}) => {
  const { control, formState, watch, setValue } = methods
  const currentStartDate = watch('datetime_from')
  const currentEndDate = watch('datetime_until')

  const handleTimeChange = React.useCallback(
    (type: 'datetime_from' | 'datetime_until', value: string | null) => {
      if (value) {
        const timeSplit = value.split(':')
        const date = currentStartDate ? new Date(currentStartDate) : new Date()
        date.setHours(Number(timeSplit[0]), Number(timeSplit[1]), 0)

        setValue(type, date)
      }
    },
    [setValue, watch]
  )

  const isFormValid = !!watch('datetime_from') && !!watch('datetime_until')

  console.log(getNearestTime())

  const getFromDisabledOptions = (option: string) => {
    const toTime = !!currentEndDate && format(currentEndDate, 'hh:mm')
    if (toTime) {
      if (option >= toTime) {
        return true
      }
    }
    return false
  }

  const getToDisabledOptions = (option: string) => {
    const fromTime = !!currentStartDate && format(currentStartDate, 'hh:mm')
    if (fromTime) {
      if (option <= fromTime) {
        return true
      }
    }
    return false
  }

  // const defaultValueFrom = React.useMemo(
  //   () => `${new Date().getHours() + 1}:00`,
  //   []
  // )

  // const defaultValueTo = React.useMemo(
  //   () => `${new Date().getHours() + 2}:00`,
  //   []
  // )

  // React.useEffect(() => {
  //   setValue('datetime_from', defaultValueFrom)
  //   setValue('datetime_until', defaultValueTo)
  // }, [])

  const generateOptionsOrder = React.useCallback((type: 'from' | 'until') => {
    const time = `${new Date().getHours() + type === 'from' ? 1 : 2}:00`
    const index = timeSlots?.indexOf(time)
    return timeSlots.slice(index).concat(timeSlots.slice(0, index))
  }, [])

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
            name="datetime_from"
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
                handleTimeChange('datetime_from', value)
              }
              options={generateOptionsOrder('from')}
              //defaultValue={defaultValueFrom}
              //IDK if we should use from disabled options
              //getOptionDisabled={getFromDisabledOptions}
            />
            <Typography sx={{ fontWeight: 200, fontSize: '2rem' }}>
              -
            </Typography>

            <TimePicker
              label="To"
              sx={{ width: '40%', ml: 2 }}
              onChange={(value: string | null) =>
                handleTimeChange('datetime_until', value)
              }
              options={generateOptionsOrder('until')}
              getOptionDisabled={getToDisabledOptions}
              //defaultValue={defaultValueTo}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
        <IconButton onClick={onBackClicked} color="primary">
          <ArrowBackIosNewIcon />
        </IconButton>
        {/* <OffliButton
          onClick={onBackClicked}
          sx={{ width: '40%' }}
          variant="text"
        >
          Back
        </OffliButton> */}
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
