import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import LabeledTile from '../../../components/labeled-tile'
import OffliButton from '../../../components/offli-button'
import SearchIcon from '@mui/icons-material/Search'
import BuddyItemCheckbox from '../../../api/activities/buddy-item-checkbox'
import BuddyItemInvite from '../../../components/buddy-item-invite'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getBuddies,
  inviteBuddy,
  uninviteBuddy,
} from '../../../api/activities/requests'
import { IPerson } from '../../../types/activities/activity.dto'
import { useDebounce } from 'use-debounce'
import { useSnackbar } from 'notistack'
import { AuthenticationContext } from '../../../assets/theme/authentication-provider'

interface IActivityTypeFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

const budky = [
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
  {
    id: '2312',
    name: 'Milada Jankovic',
    username: 'milhaus',
    profile_photo:
      'https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png',
  },
]

export const ActivityInviteForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext)
  const { control, setValue, watch } = methods
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()

  const [queryString, setQueryString] = React.useState<string | undefined>()
  const [queryStringDebounced] = useDebounce(queryString, 1000)

  const { data: buddies, isLoading } = useQuery(
    ['buddies', userInfo?.id, queryStringDebounced],
    // TODO Fetch with current user id
    () => getBuddies(String(userInfo?.id), queryStringDebounced),
    {
      // enabled: !!queryStringDebounced,
      enabled: !!userInfo?.id,
    }
  )

  const { mutate: sendInviteBuddy } = useMutation(
    ['invite-person'],
    (values: IPerson) => inviteBuddy(2, values),
    {
      onSuccess: (data, variables) => {
        setInvitedBuddies([...invitedBuddies, variables?.id])
      },
      onError: error => {
        enqueueSnackbar('Failed to invite user', { variant: 'error' })
      },
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
      <Box sx={{ display: 'flex', mb: 3, mt: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h4">
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
        <TextField
          // TODO idk if this is really needed and not anti-pattern
          //autoFocus
          value={queryString}
          onChange={e => setQueryString(e.target.value)}
          sx={{ width: '100%' }}
          label="Search within your buddies"
          // InputProps={{
          //   startAdornment: <SearchIcon />,
          // }}
          placeholder="Type buddy username"
        />
        {buddies?.data && buddies?.data?.length < 1 ? (
          <Box
            sx={{
              height: 100,
              width: '100%',
              my: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '1px solid lightgrey',
              borderBottom: '1px solid lightgrey',
            }}
          >
            <Typography sx={{ color: theme => theme.palette.inactive.main }}>
              No buddies to invite
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              my: 3,
              borderTop: '1px solid lightgrey',
              borderBottom: '1px solid lightgrey',
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              buddies?.data?.map(buddy => (
                <BuddyItemInvite
                  key={buddy?.id}
                  onInviteClick={handleBuddyInviteClick}
                  buddy={buddy}
                  invited={invitedBuddies?.includes(buddy?.id)}
                />
              ))
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%' }}
          //disabled={!formState.isValid}
        >
          Skip
        </OffliButton>
      </Box>
    </>
  )
}
