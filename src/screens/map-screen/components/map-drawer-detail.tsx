import { CircularProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { format } from "date-fns";
import { sk } from "date-fns/esm/locale";
import React from "react";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { useActivities } from "../../../hooks/use-activities";
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
import ActionButton from "components/action-button";
import ActionButtons from "./action-buttons";

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
              // flexWrap: "wrap",
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
              // distance={activity?.}
              distance={calculateDistance(
                activity?.location?.coordinates,
                myLocation
              )}
              price={activity?.price}
            />

            {/* TODO implement action buttons 
            <ActionButtons 
            onJoinClick={handleJoinButtonClick}
            areActionsLoading={areActionsLoading}
            isCreator={isCreator}
            isAlreadyParticipant={isAlreadyParticipant}
            isPublic={activity?.visibility === ActivityVisibilityEnum.public}/> */}
            
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
            <ActivityDuration duration={`${durationHours} hours, ${durationMinutes} minutes`} />
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
