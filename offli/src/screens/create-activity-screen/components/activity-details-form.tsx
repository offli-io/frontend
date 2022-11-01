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
import {
  ActivityFeesOptionsEnum,
  ActivityRepetitionOptionsEnum,
} from '../../../types/common/types'

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

export const ActivityDetailsForm: React.FC<IPlaceFormProps> = ({
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
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Typography variant="h4">Activity details</Typography>
        </Box>
        <Controller
          name="accessibility"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* TODO add only boolean to hook form for example public, which will be either false or true */}
              {/* <Typography>Accessibility</Typography> */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-around',
                  mb: 5,
                }}
              >
                {/* <FormLabel
                //sx={!field.value ? { color: 'black' } : {}}
                >
                  Accessibility
                </FormLabel> */}
                <Typography sx={{ fontWeight: 'bold' }}>
                  Accessibility
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch sx={{ mx: 1 }} {...field} color="primary" />
                  <FormLabel
                  //sx={field.value ? { color: 'black' } : {}}
                  >
                    public
                  </FormLabel>
                </Box>
              </Box>
              <Controller
                name="repeated"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="outlined-select-currency"
                    select
                    label="Does activity repeat?"
                    sx={{ width: '100%', mb: 5 }}
                    // helperText="Please select your currency"
                  >
                    {Object.values(ActivityRepetitionOptionsEnum).map(
                      option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                )}
              />
            </Box>
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
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              // TODO idk if this is really needed and not anti-pattern
              //autoFocus
              {...field}
              error={!!error}
              label="Additional description"
              placeholder="Type more info about the activity"
              sx={{ mb: 5, width: '100%' }}
              //helperText={!!error && 'Activity name is required'}
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
          justifyContent: 'flex-end',
          mt: 2,
        }}
      >
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%' }}
          disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
