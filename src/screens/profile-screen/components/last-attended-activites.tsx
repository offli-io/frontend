import { Box, Typography, useTheme } from "@mui/material";
import MyActivityCard from "components/my-activity-card";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivitiyParticipantStatusEnum } from "types/activities/activity-participant-status-enum.dto";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import { useGetLastAttendedActivities } from "../hooks/use-get-last-attended-activities";
import Loader from "components/loader";
import { AuthenticationContext } from "assets/theme/authentication-provider";

interface ILastAttendedActivitiesProps {}

const LastAttendedActivities: React.FC<ILastAttendedActivitiesProps> = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    activities: lastAttendedActivties,
    isLoading: areLastAttendedActivitiesLoading,
  } = useGetLastAttendedActivities({
    params: {
      participantId: id ? Number(id) : Number(userInfo?.id),
      participantStatus: ActivitiyParticipantStatusEnum.CONFIRMED,
      limit: 5,
    },
    enabled: !!id || !!userInfo?.id,
  });

  return !areLastAttendedActivitiesLoading &&
    [...(lastAttendedActivties ?? [])].length < 1 ? null : (
    <Box
      sx={{
        width: "90%",
      }}
    >
      <Typography
        align="left"
        variant="h5"
        sx={{ mt: 3, mb: 1, color: palette?.text?.primary }}
      >
        Last attended
      </Typography>
      {areLastAttendedActivitiesLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1.5,
            overflowX: "scroll",
            width: "100%",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          {lastAttendedActivties?.map((activity) => {
            return (
              <MyActivityCard
                activity={activity}
                type="profile"
                onPress={() =>
                  navigate(
                    `${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`
                  )
                }
                sx={{
                  minWidth: lastAttendedActivties?.length <= 1 ? "100%" : "80%",
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default LastAttendedActivities;
