import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import LabeledTile from "../../../components/labeled-tile";
import OffliButton from "../../../components/offli-button";
import SearchIcon from "@mui/icons-material/Search";
import BuddyItemInvite from "../../../components/buddy-item-invite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBuddies,
  inviteBuddy,
  uninviteBuddy,
} from "../../../api/activities/requests";
import { IPerson } from "../../../types/activities/activity.dto";
import { useDebounce } from "use-debounce";
import { useSnackbar } from "notistack";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { ICreateActivityRequestDto } from "../../../types/activities/create-activity-request.dto";
import { ActivityInviteStateEnum } from "../../../types/activities/activity-invite-state-enum.dto";

interface IActivityTypeFormProps {
  onNextClicked: () => void;
  methods: UseFormReturn;
}

const budky = [
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
  {
    id: "2312",
    name: "Milada Jankovic",
    username: "milhaus",
    profile_photo:
      "https://w7.pngwing.com/pngs/569/273/png-transparent-silhouette-human-head-head-face-animals-head-thumbnail.png",
  },
];

export const ActivityInviteForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { control, setValue, watch } = methods;
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const activityId = queryClient.getQueryData<ICreateActivityRequestDto>([
    "created-activity-data",
  ]);
  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 1000);

  const { data: buddies, isLoading } = useQuery(
    ["buddies", userInfo?.id, queryStringDebounced],
    // TODO Fetch with current user id
    () => getBuddies(String(userInfo?.id), queryStringDebounced),
    {
      // enabled: !!queryStringDebounced,
      enabled: !!userInfo?.id,
    }
  );

  const { mutate: sendInviteBuddy } = useMutation(
    ["invite-person"],
    (buddy?: IPerson) =>
      inviteBuddy(String(activityId?.id), {
        ...buddy,
        invited_by: userInfo?.id,
        status: ActivityInviteStateEnum.INVITED,
        profile_photo: (buddy as any)?.profile_photo_url,
      }),
    {
      onSuccess: (data, buddy) => {
        setInvitedBuddies([...invitedBuddies, String(buddy?.id)]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to invite user", { variant: "error" });
      },
    }
  );

  const { mutate: sendUninviteBuddy } = useMutation(
    ["uninvite-person"],
    (buddyId?: string) =>
      uninviteBuddy(String(activityId?.id), String(buddyId)),
    {
      onSuccess: (data, buddyId) => {
        const _buddies = invitedBuddies?.filter((buddy) => buddy !== buddyId);
        setInvitedBuddies(_buddies);
      },
      // onError: error => {
      //   enqueueSnackbar('Failed to create new activity', { variant: 'error' })
      // },
    }
  );

  const handleBuddyInviteClick = React.useCallback(
    (buddy: IPerson) => {
      //fire request for invite
      if (invitedBuddies?.includes(String(buddy?.id))) {
        sendUninviteBuddy(buddy?.id);
      } else {
        sendInviteBuddy(buddy);
      }
    },
    [invitedBuddies, sendInviteBuddy, sendUninviteBuddy]
  );

  return (
    <>
      <Box sx={{ display: "flex", mb: 3, mt: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h4">
          Send invites to your buddies
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TextField
          // TODO idk if this is really needed and not anti-pattern
          //autoFocus
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          sx={{ width: "100%" }}
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
              width: "100%",
              my: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              No buddies to invite
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              my: 3,
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              buddies?.data?.map((buddy) => (
                <BuddyItemInvite
                  key={buddy?.id}
                  onInviteClick={handleBuddyInviteClick}
                  buddy={buddy}
                  invited={invitedBuddies?.includes(String(buddy?.id))}
                />
              ))
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: "40%" }}
          //disabled={!formState.isValid}
        >
          Skip
        </OffliButton>
      </Box>
    </>
  );
};
