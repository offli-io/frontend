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
  const { control, setValue, watch } = methods

  const tags: string[] = watch('tags') ?? []

  const handleTileClick = React.useCallback(
    (title: string) => {
      if (tags?.includes(title)) {
        const updatedTags = tags.filter((tag: string) => tag !== title)
        setValue('tags', updatedTags)
      } else {
        const updatedTags = [...tags, title]
        setValue('tags', updatedTags)
      }
    },
    [tags, setValue]
  )

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">Select</Typography>
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          type
        </Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <LabeledTile title="Sports and drinks" onClick={handleTileClick} />
        <LabeledTile title="Relax" sx={{ ml: 3 }} onClick={handleTileClick} />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '80%' }}
          //disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
