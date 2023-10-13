import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import OffliButton from "components/offli-button";
import React from "react";
import userPlaceholder from "../../../assets/img/user-placeholder.svg";
import { useGetApiUrl } from "../../../hooks/use-get-api-url";
import { IPerson } from "../../../types/activities/activity.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticationContext } from "assets/theme/authentication-provider";
import { changeActivityParticipantStatus } from "api/activities/requests";
import { ActivityInviteStateEnum } from "types/activities/activity-invite-state-enum.dto";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "hooks/use-participant-activities";
import { toast } from "sonner";
import { useActivities } from "hooks/use-activities";
import { IActivityRestDto } from "types/activities/activity-rest.dto";
import { ActivitiyParticipantStatusEnum } from "types/activities/activity-participant-status-enum.dto";

interface IProps {
  creator?: IPerson;
  activityId?: number;
}

export const CreatorJoinRow: React.FC<IProps> = ({ creator, activityId }) => {
  const baseUrl = useGetApiUrl();
  const { shadows } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const { data: { data: { activity = undefined } = {} } = {} } =
    useActivities<IActivityRestDto>({
      params: {
        id: activityId ? Number(activityId) : undefined,
        participantId: userInfo?.id,
      },
    });

  const { mutate: sendJoinActivity, isLoading } = useMutation(
    ["join-activity-response"],
    (activityId?: number) => {
      return changeActivityParticipantStatus(
        Number(activityId),
        Number(userInfo?.id),
        {
          status: ActivityInviteStateEnum.CONFIRMED,
        }
      );
    },
    {
      onSuccess: (data, buddy) => {
        toast.success("You have successfully joined the activity");
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries(["activities"]);
      },
      onError: (error) => {
        toast.error("Failed to join selected activity");
      },
    }
  );

  const isAlreadyParticipant = React.useMemo(
    () =>
      !!activity &&
      activity?.participant_status === ActivitiyParticipantStatusEnum.CONFIRMED,

    [activity]
  );

  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        gridTemplateColumns: "8fr 2fr",
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
          mr: 2,
        }}
      >
        <img
          src={
            creator?.profile_photo
              ? `${baseUrl}/files/${creator?.profile_photo}`
              : userPlaceholder
          }
          alt="profile"
          style={{
            height: "25px",
            width: "25px",
            borderRadius: "50%",
            boxShadow: shadows[3],
            margin: 10,
          }}
        />
        <Typography variant="subtitle1" align="left">
          {creator?.username ?? "User"}
        </Typography>
      </Box>
      <OffliButton
        sx={{ fontSize: 16, width: 100 }}
        onClick={() => sendJoinActivity(activityId)}
        isLoading={isLoading}
        size="small"
        disabled={isAlreadyParticipant}
      >
        Join
      </OffliButton>
    </Box>
  );
};
