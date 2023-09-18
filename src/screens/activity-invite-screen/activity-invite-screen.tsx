import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { IPerson } from "../../types/activities/activity.dto";
import {
  getActivityParticipants,
  getBuddies,
  inviteBuddyToActivity,
  uninviteBuddy,
} from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import BuddyItemInvite from "../../components/buddy-item-invite";
import OffliButton from "../../components/offli-button";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { ActivitiyParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import { useBuddies } from "hooks/use-buddies";

export const ActivityInviteScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 1000);

  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(
    ["activity-participants", id],
    () => getActivityParticipants({ activityId: Number(id) }),
    {
      enabled: !!id,
    }
  );
  const { buddies, isLoading } = useBuddies({
    text: queryStringDebounced,
  });

  const { mutate: sendInviteBuddy, isLoading: isInviting } = useMutation(
    ["invite-participant"],
    (buddy?: IPerson) =>
      inviteBuddyToActivity(Number(id), Number(buddy?.id), {
        status: ActivityInviteStateEnum.INVITED,
        invited_by_id: Number(userInfo?.id),
      }),
    {
      onSuccess: (data, buddy) => {
        queryClient.invalidateQueries(["activity-participants"]);
        // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to invite user", { variant: "error" });
      },
    }
  );

  const { mutate: sendUninviteBuddy, isLoading: isUninviting } = useMutation(
    ["uninvite-person"],
    (buddyId?: number) => uninviteBuddy(Number(id), Number(buddyId)),
    {
      onSuccess: (data, buddyId) => {
        queryClient.invalidateQueries(["activity-participants"]);
        // const _buddies = invitedBuddies?.filter((buddy) => buddy !== buddyId);
        // setInvitedBuddies(_buddies);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to cancel invite for user", {
          variant: "error",
        });
      },
    }
  );

  const handleBuddyInviteClick = React.useCallback(
    (buddy: IPerson) => {
      //fire request for invite
      if (invitedBuddies?.includes(Number(buddy?.id))) {
        sendUninviteBuddy(buddy?.id);
      } else {
        sendInviteBuddy(buddy);
      }
    },
    [invitedBuddies, sendInviteBuddy, sendUninviteBuddy]
  );

  React.useEffect(() => {
    if (participants?.length > 0) {
      const alreadyInvitedParticipants = participants
        ?.filter(
          ({ status }) => status === ActivitiyParticipantStatusEnum.INVITED
        )
        ?.map(({ id }) => id);
      setInvitedBuddies(alreadyInvitedParticipants);
    }
  }, [participants]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        p: 2,
      }}
    >
      <TextField
        value={queryString}
        onChange={(e) => setQueryString(e.target.value)}
        sx={{ width: "100%" }}
        label="Search within your buddies"
        placeholder="Type buddy username"
        data-testid="activity-invite-buddies-input"
      />
      {buddies && buddies?.length < 1 ? (
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
            buddies?.map((buddy) => (
              <BuddyItemInvite
                key={buddy?.id}
                onInviteClick={handleBuddyInviteClick}
                buddy={buddy}
                invited={invitedBuddies?.includes(Number(buddy?.id))}
                isLoading={isInviting || isUninviting}
              />
            ))
          )}
        </Box>
      )}
    </Box>
  );
};
