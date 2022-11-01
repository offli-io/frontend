import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import LabeledTile from '../../../components/labeled-tile'
import OffliButton from '../../../components/offli-button'
import SearchIcon from '@mui/icons-material/Search'
import BuddyItem from '../../../components/buddy-item'

interface IActivityTypeFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

const activityTypes = [
  'Sports and drinks',
  'Relax',
  'Cinema',
  'Food',
  'Music',
  'Nature',
  'Adrenaline',
  'Charitable',
]

export const ActivityInviteForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, setValue, watch } = methods
  const [pendingInviteBuddies, setPendingInviteBuddies] = React.useState<
    number[]
  >([])

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

  const handleBuddyClick = React.useCallback(
    (id: number, checked?: boolean) => {
      if (checked) {
        setPendingInviteBuddies([...pendingInviteBuddies, id])
      } else {
        const filteredBuddies = pendingInviteBuddies.filter(
          (buddyId: number) => buddyId !== id
        )
        setPendingInviteBuddies(filteredBuddies)
      }
    },
    [pendingInviteBuddies]
  )

  console.log(pendingInviteBuddies)

  return (
    <>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h4">Activity details</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Controller
          name="capacity"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              // TODO idk if this is really needed and not anti-pattern
              //autoFocus
              {...field}
              error={!!error}
              sx={{ width: '100%', mb: 2 }}
              label="How many people can attend?"
              //placeholder="Type activity name"
              helperText={'Leave empty for unlimited'}
              //label="Username"
              // disabled={methodSelectionDisabled}
            />
          )}
        />
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h6">
          Send invites to your buddies
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Controller
          name="capacity"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              // TODO idk if this is really needed and not anti-pattern
              //autoFocus
              {...field}
              error={!!error}
              sx={{ width: '100%' }}
              label="Search within your buddies"
              // InputProps={{
              //   startAdornment: <SearchIcon />,
              // }}
              placeholder="Type buddy username"
              //label="Username"
              // disabled={methodSelectionDisabled}
            />
          )}
        />
        <Box
          sx={{
            height: 300,
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            my: 3,
          }}
        >
          <BuddyItem
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={1}
          />
          <BuddyItem
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={2}
          />
          <BuddyItem
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={3}
          />
          <BuddyItem
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={4}
          />
          <BuddyItem
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={5}
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%' }}
          //disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
