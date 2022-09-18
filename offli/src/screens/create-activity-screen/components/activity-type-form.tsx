import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import LabeledTile from '../../../components/labeled-tile'
import OffliButton from '../../../components/offli-button'

interface IActivityTypeFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const ActivityTypeForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState } = methods

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Select</Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          type
        </Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <LabeledTile
          label="Sports and drinks"
          onClick={(id: number) => console.log(id)}
        />
        <LabeledTile
          label="Relax"
          sx={{ ml: 3 }}
          onClick={(id: number) => console.log(id)}
        />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* <OffliButton
          onClick={onNextClicked}
          sx={{ width: '80%' }}
          disabled={!formState.isValid}
        >
          Next
        </OffliButton> */}
      </Box>
    </>
  )
}
