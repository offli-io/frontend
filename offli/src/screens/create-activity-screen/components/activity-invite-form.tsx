import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import LabeledTile from '../../../components/labeled-tile'
import OffliButton from '../../../components/offli-button'
import SearchIcon from '@mui/icons-material/Search'
import BuddyItemCheckbox from '../../../components/buddy-item-checkbox'
import BuddyItemInvite from '../../../components/buddy-item-invite'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getBuddies,
  inviteBuddy,
  uninviteBuddy,
} from '../../../api/activities/requests'
import { IPerson } from '../../../types/activities/activity.dto'

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
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([])

  const { data: buddies, status } = useQuery(
    ['profile', 5],
    // TODO Fetch with current user id
    () => getBuddies(7)
  )

  const { mutate: sendInviteBuddy } = useMutation(
    ['invite-person'],
    (values: IPerson) => inviteBuddy(2, values),
    {
      onSuccess: (data, variables) => {
        setInvitedBuddies([...invitedBuddies, variables?.id])
      },
      // onError: error => {
      //   enqueueSnackbar('Failed to create new activity', { variant: 'error' })
      // },
    }
  )

  const { mutate: sendUninviteBuddy } = useMutation(
    ['uninvite-person'],
    (values: IPerson) => uninviteBuddy(2, Number(values?.id)),
    {
      onSuccess: (data, variables) => {
        const _buddies = invitedBuddies?.filter(
          buddy => buddy !== variables?.id
        )
        setInvitedBuddies(_buddies)
      },
      // onError: error => {
      //   enqueueSnackbar('Failed to create new activity', { variant: 'error' })
      // },
    }
  )

  const handleBuddyInviteClick = React.useCallback((buddy: IPerson) => {
    //fire request for invite
    if (invitedBuddies?.includes(buddy?.id)) {
      sendUninviteBuddy(buddy)
    } else {
      sendInviteBuddy(buddy)
    }
  }, [])

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
          <BuddyItemInvite
            username="Milada Jankovicova"
            checkbox
            onInviteClick={handleBuddyInviteClick}
            buddy={{
              id: '2312',
              name: 'Milada Jankovic',
              username: 'milhaus',
              profile_photo:
                'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
            }}
            invited={invitedBuddies?.includes('2312')}
          />
          <BuddyItemInvite
            username="Milada Jankovicova"
            buddy={{
              id: '2313',
              name: 'Milada Jankovic',
              username: 'milhaus',
              profile_photo:
                'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
            }}
            checkbox
            onInviteClick={handleBuddyInviteClick}
            invited={invitedBuddies?.includes('2313')}
          />
          {/* <BuddyItemCheckbox
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={3}
          />
          <BuddyItemCheckbox
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={4}
          />
          <BuddyItemCheckbox
            username="Milada Jankovicova"
            checkbox
            onClick={handleBuddyClick}
            id={5}
          /> */}
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
