import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { ActivityFeesOptionsEnum } from '../../../types/common/types'

interface IPlaceFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

const top100Films = [
  {
    type: 'idk',
    id: 225,
    lat: 22.5,
    lon: 32.8,
    tags: {
      city_limit: 'ahoj',
      name: 'Bratislava',
      traffic_sign: 'auta',
    },
  },
  {
    type: 'neviem',
    id: 226,
    lat: 22.9,
    lon: 12.05,
    tags: {
      city_limit: 'cauko',
      name: 'Praha',
      traffic_sign: 'tramvaj',
    },
  },
]

export const PlaceForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, handleSubmit, formState, watch } = methods

  // filter backend results based on query string
  const queryString = watch('place')
  console.log(queryString)

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'flex-start',
        }}
      >
        <Controller
          name="place"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              options={top100Films}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mb: 5,
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newvalue) => field.onChange(newvalue)}
              getOptionLabel={option => option?.tags?.name}
              renderInput={params => (
                <TextField {...params} label="Add place" />
              )}
            />
          )}
        />
        <Controller
          name="fee"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id="outlined-select-currency"
              select
              sx={{ width: '100%', mb: 5 }}
              label="Any fees?"
              // helperText="Please select your currency"
            >
              {Object.values(ActivityFeesOptionsEnum).map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="accessibility"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* TODO add only boolean to hook form for example public, which will be either false or true */}
              <Typography>Accessibility</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FormLabel sx={!field.value ? { color: 'black' } : {}}>
                  public
                </FormLabel>
                <Switch sx={{ mx: 1 }} {...field} color="primary" />
                <FormLabel sx={field.value ? { color: 'black' } : {}}>
                  private
                </FormLabel>
              </Box>
            </Box>
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
