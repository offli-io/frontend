import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import { ActivityVisibilityEnum } from '../../../types/activities/activity-visibility-enum.dto'
import {
  ActivityPriceOptionsEnum,
  ActivityRepetitionOptionsEnum,
} from '../../../types/common/types'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

interface IPlaceFormProps {
  onNextClicked: () => void

  onBackClicked: () => void
  methods: UseFormReturn
}

export const ActivityDetailsForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  onBackClicked,
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
          name="visibility"
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
                  <Switch
                    sx={{ mx: 1 }}
                    {...field}
                    value={
                      field?.value === ActivityVisibilityEnum.private
                        ? false
                        : true
                    }
                    onChange={e => {
                      field.onChange(
                        e.target.checked
                          ? ActivityVisibilityEnum.public
                          : ActivityVisibilityEnum.private
                      )
                    }}
                    color="primary"
                  />
                  <FormLabel
                  //sx={field.value ? { color: 'black' } : {}}
                  >
                    public
                  </FormLabel>
                </Box>
              </Box>

              <Controller
                name="price"
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
                    {Object.values(ActivityPriceOptionsEnum).map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="limit"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    // TODO idk if this is really needed and not anti-pattern
                    //autoFocus
                    {...field}
                    error={!!error}
                    sx={{ width: '100%', mb: 5 }}
                    label="Capacity"
                    // InputProps={{
                    //   startAdornment: <SearchIcon />,
                    // }}
                    placeholder="Type activity capacity"
                    //label="Username"
                    // disabled={methodSelectionDisabled}
                  />
                )}
              />

              {/* 
              TODO FOR v2 maybe
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
              /> */}
            </Box>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              // TODO idk if this is really needed and not anti-pattern
              //autoFocus
              {...field}
              multiline
              rows={3}
              error={!!error}
              label="Additional description"
              placeholder="Type more info about the activity"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: 'unset',
                },
              }}
              inputProps={{ maxLength: 200 }}
              helperText={`${field?.value?.length ?? 0}/200`}
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
          justifyContent: 'space-between',
          mt: 2,
        }}
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
          disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
