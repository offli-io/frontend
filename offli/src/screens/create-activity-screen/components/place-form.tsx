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
import activityLocation from '../../../assets/img/activity-location.svg'
import { useQuery } from '@tanstack/react-query'
import { getLocationFromQuery } from '../../../api/activities/requests'

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
  const { control, setValue, formState, watch } = methods

  // filter backend results based on query string
  const queryString = watch('placeQuery')

  console.log(queryString)

  const placeQuery = useQuery(
    ['locations', queryString],
    props => getLocationFromQuery(queryString),
    {
      enabled: !!queryString,
    }
  )
  console.log(placeQuery?.data?.data)

  return (
    <>
      <Box
        sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', mt: -8 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
          }}
        >
          <Typography variant="h4">Add place</Typography>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <img src={activityLocation} style={{ height: 80 }} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'flex-start',
          mt: 4,
        }}
      >
        <Controller
          name="place"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              options={placeQuery?.data?.data ?? []}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
              loading={placeQuery?.isLoading}
              // isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newvalue) => field.onChange(newvalue)}
              getOptionLabel={option => option?.display_name}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Search place"
                  onChange={e => setValue('placeQuery', e.target.value)}
                />
              )}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
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
