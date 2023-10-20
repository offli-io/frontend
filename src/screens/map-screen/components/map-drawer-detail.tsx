import { CircularProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { format } from "date-fns";
import { sk } from "date-fns/esm/locale";
import React from "react";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import {
  ACTIVITIES_QUERY_KEY,
  PAGED_ACTIVITIES_QUERY_KEY,
  useActivities,
} from "../../../hooks/use-activities";
import { useGetApiUrl } from "../../../hooks/use-get-api-url";
import { useUser } from "../../../hooks/use-user";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";
import { calculateDistance } from "../../../utils/calculate-distance.util";
import { DATE_TIME_FORMAT, TIME_FORMAT } from "../../../utils/common-constants";
import ActivityTags from "../../activity-details-screen/components/activity-tags";
import { getTimeDifference } from "../utils/get-time-difference";
import ActivityDetailTiles from "./activity-detail-tiles";
import ActivityDuration from "./activity-duration";
import AdditionalDescription from "./additional-description";
import BasicInformation from "./basic-information";
import CreatedTimestamp from "./created-timestamp";
import { CreatorVisibilityRow } from "./creator-visibility-row";
import ActionButtons from "./action-buttons";
import { ActivitiyParticipantStatusEnum as ActivityParticipantStatusEnum } from "../../../types/activities/activity-participant-status-enum.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeActivityParticipantStatus,
  removePersonFromActivity,
} from "api/activities/requests";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "hooks/use-participant-activities";
import { ActivityInviteStateEnum } from "types/activities/activity-invite-state-enum.dto";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityVisibilityEnum } from "types/activities/activity-visibility-enum.dto";
import { ApplicationLocations } from "types/common/applications-locations.dto";

interface IProps {
  activityId?: number;
}

const MainBox = styled(Box)(() => ({
  width: "100%",
  position: "relative",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  visibility: "visible",
  right: 0,
  left: 0,
  height: 450,
}));

const MapDrawerDetail: React.FC<IProps> = ({ activityId }) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      params: {
        id: activityId,
      },
    });

  const { data: { data = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const myLocation = data?.location?.coordinates;
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const participantsNum = `${activity?.count_confirmed}/${activity?.limit}`;

  const dateTimeFrom = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;
  const dateTimeUntil = activity?.datetime_until
    ? new Date(activity?.datetime_until)
    : null;
  const dateTimeCreatedAt = activity?.created_at
    ? new Date(activity?.created_at)
    : null;

  const timeDifference = getTimeDifference(dateTimeFrom, dateTimeUntil); // useMemo??
  const durationMinutes = timeDifference?.durationMinutes;
  const durationHours = timeDifference?.durationHours;

  const { mutate: sendLeaveActivity, isLoading: isLeavingActivity } =
    useMutation(
      ["leave-activity"],
      (activityId?: number) =>
        removePersonFromActivity({ activityId, personId: userInfo?.id }),
      {
        onSuccess: (data, activityId) => {
          //TODO add generic jnaming for activites / activity
          queryClient.invalidateQueries(["activity", activityId]);
          queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

          toast.success("You have successfully left the activity");
          //invalidate queries
          //TODO display success notification?
        },
        onError: () => {
          toast.error("Failed to leave activity");
        },
      }
    );

  const { mutate: sendJoinActivity, isLoading: isJoiningActivity } =
    useMutation(
      ["join-activity"],
      () =>
        changeActivityParticipantStatus(
          Number(activityId),
          Number(userInfo?.id),
          {
            status: ActivityInviteStateEnum.CONFIRMED,
          }
        ),
      {
        onSuccess: () => {
          toast.success("You have successfully joined the activity");
          queryClient.invalidateQueries(["paged-activities"]);
          queryClient.invalidateQueries(["activity", activityId]);
          queryClient.invalidateQueries(["activity-participants", activityId]);
          queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
          navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`);

          // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
        },
        onError: (error) => {
          toast.error("Failed to join activity");
        },
      }
    );

  const areActionsLoading = isLeavingActivity || isJoiningActivity;
  const isCreator = activity?.creator?.id === userInfo?.id;

  const isAlreadyParticipant = React.useMemo(
    () =>
      !!activity &&
      activity?.participant_status === ActivityParticipantStatusEnum.CONFIRMED,

    [activity]
  );

  const handleJoinButtonClick = React.useCallback(() => {
    isAlreadyParticipant
      ? sendLeaveActivity(Number(activityId))
      : sendJoinActivity();
  }, [isAlreadyParticipant, isCreator, activityId]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            my: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MainBox>
          <Box
            sx={{
              width: "95%",
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              ml: 0.5,
              wordWrap: "break-word",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                my: 1,
              }}
            >
              {activity?.title}
            </Typography>
            <ActivityDetailTiles
              participantsNum={participantsNum}
              dateTime={
                dateTimeFrom
                  ? format(dateTimeFrom, TIME_FORMAT, { locale: sk })
                  : "-"
              }
              distance={calculateDistance(
                activity?.location?.coordinates,
                myLocation
              )}
              price={activity?.price}
            />

            <ActionButtons
              onJoinClick={handleJoinButtonClick}
              areActionsLoading={areActionsLoading}
              isCreator={isCreator}
              isAlreadyParticipant={isAlreadyParticipant}
              isPublic={activity?.visibility === ActivityVisibilityEnum.public}
              activity={activity}
            />

            <img
              src={
                activity?.title_picture
                  ? `${baseUrl}/files/${activity?.title_picture}`
                  : //TODO add activity placeholder
                    ""
              }
              alt="activity_title_photo"
              style={{
                width: "100%",
              }}
            />
            {activity?.creator ? (
              <CreatorVisibilityRow
                creator={activity?.creator}
                activityId={activityId}
              />
            ) : null}
            <BasicInformation
              locationName={activity?.location?.name}
              dateTime={
                dateTimeFrom
                  ? `${format(dateTimeFrom, DATE_TIME_FORMAT, {
                      locale: sk,
                    })}`
                  : "-"
              }
              price={activity?.price}
              participantsNum={participantsNum}
            />
            <ActivityDuration
              duration={`${durationHours} hours, ${durationMinutes} minutes`}
            />
            <ActivityTags tags={activity?.tags} sx={{ my: 1 }} />
            {activity?.description ? (
              <AdditionalDescription description={activity?.description} />
            ) : null}

            <CreatedTimestamp
              timestamp={
                dateTimeCreatedAt
                  ? `${format(dateTimeCreatedAt, DATE_TIME_FORMAT, {
                      locale: sk,
                    })}`
                  : "-"
              }
            />
          </Box>
        </MainBox>
      )}
    </>
  );
};

export default MapDrawerDetail;
