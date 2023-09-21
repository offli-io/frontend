import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebounce } from "use-debounce";
import {
  getBuddies,
  inviteBuddyToActivity,
  uninviteBuddy,
} from "../../../api/activities/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import BuddyItemInvite from "../../../components/buddy-item-invite";
import OffliButton from "../../../components/offli-button";
import { ActivityInviteStateEnum } from "../../../types/activities/activity-invite-state-enum.dto";
import { IPerson } from "../../../types/activities/activity.dto";
import { ICreateActivityRequestDto } from "../../../types/activities/create-activity-request.dto";
import { useBuddies } from "hooks/use-buddies";

interface IActivityTypeFormProps {
  onNextClicked: () => void;
  methods: UseFormReturn;
}

export const ActivityInviteForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const activityId = queryClient.getQueryData<ICreateActivityRequestDto>([
    "created-activity-data",
  ]);
  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 1000);

  const { buddies, isLoading } = useBuddies({
    text: queryStringDebounced,
  });

  const { mutate: sendInviteBuddy, isLoading: isInviting } = useMutation(
    ["invite-participant"],
    (buddy?: IPerson) =>
      inviteBuddyToActivity(Number(activityId?.id), Number(buddy?.id), {
        status: ActivityInviteStateEnum.INVITED,
        invited_by_id: Number(userInfo?.id),
      }),
    {
      onSuccess: (data, buddy) => {
        setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to invite user", { variant: "error" });
      },
    }
  );

  const { mutate: sendUninviteBuddy, isLoading: isUninviting } = useMutation(
    ["uninvite-person"],
    (buddyId?: number) =>
      uninviteBuddy(Number(activityId?.id), Number(buddyId)),
    {
      onSuccess: (data, buddyId) => {
        const _buddies = invitedBuddies?.filter((buddy) => buddy !== buddyId);
        setInvitedBuddies(_buddies);
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

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: "40%" }}
          data-testid="skip-btn"
        >
          Skip
        </OffliButton>
      </Box>
    </>
  );
};
