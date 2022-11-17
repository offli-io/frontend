import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import createActivityImg from '../../../assets/img/create-activity.svg'

interface INameFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const NameForm: React.FC<INameFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState } = methods

  return (
    <>
      <Box
        sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', mt: -8 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '50%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            Create
          </Typography>
          <Typography variant="h4">new activity</Typography>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <img src={createActivityImg} style={{ height: 80 }} />
        </Box>
      </Box>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 8 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              // TODO idk if this is really needed and not anti-pattern
              //autoFocus
              {...field}
              error={!!error}
              sx={{ width: '100%' }}
              label="Name"
              placeholder="Type activity name"
              helperText={!!error && 'Activity name is required'}
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
          //TODO some bug isValid returning false when name is
          //disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
