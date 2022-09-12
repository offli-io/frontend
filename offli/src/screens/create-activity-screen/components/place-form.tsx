import {
  Autocomplete,
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
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Typography variant="h4">Add</Typography>
          <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
            place
          </Typography>
        </Box>
        <Controller
          name="place"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              options={top100Films}
              sx={{ width: '90%' }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newvalue) => field.onChange(newvalue)}
              getOptionLabel={option => option?.tags?.name}
              renderInput={params => (
                <TextField {...params} label="Search place" />
              )}
            />
          )}
        />
      </Box>
      {/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Controller
          name="place"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              options={top100Films}
              sx={{ width: '90%' }}
              renderInput={params => (
                <TextField {...params} {...field} label="Search place" />
              )}
            />
          )}
        />
      </Box> */}
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
