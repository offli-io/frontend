import { CircularProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { format } from "date-fns";
import { sk } from "date-fns/esm/locale";
import React from "react";
import { useActivities } from "../../../hooks/use-activities";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";
import { DATE_TIME_FORMAT, TIME_FORMAT } from "../../../utils/common-constants";
import ActivityTags from "../../activity-details-screen/components/activity-tags";
import { getTimeDifference } from "../utils/get-time-difference";
import ActivityDetailTiles from "./activity-detail-tiles";
import ActivityDuration from "./activity-duration";
import AdditionalDescription from "./additional-description";
import BasicInformation from "./basic-information";
import CreatedTimestamp from "./created-timestamp";
import { CreatorVisibilityRow } from "./creator-visibility-row";
import userPlaceholder from "../../../assets/img/user-placeholder.svg";

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
  // display: "flex",
  // flexDirection: "column",
}));

const MapDrawerDetail: React.FC<IProps> = ({ activityId }) => {
  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      id: activityId,
    });

  const participantsNum = `${activity?.count_confirmed}/${activity?.limit}`;

  // const timeStampFrom = Date.parse(activity?.datetime_from!.toString());
  const dateTimeFrom = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;
  // const timeStampUntil = Date.parse(activity?.datetime_until!.toString());
  const dateTimeUntil = activity?.datetime_until
    ? new Date(activity?.datetime_until)
    : null;
  // const timeStampCreatedAt = Date.parse(activity?.datetime_until!.toString());
  const dateTimeCreatedAt = new Date();

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
              price={activity?.price}
            />
            <ActivityTags tags={activity?.tags} />
            {activity?.creator ? (
              <CreatorVisibilityRow
                creator={activity?.creator}
                visibility={activity?.visibility}
              />
            ) : null}
            {/* <React.Suspense fallback={<div>Loading ...</div>}> */}
            {/* TODO handle lazy image loading */}
            <img
              src={activity?.title_picture}
              alt="activity_title_photo"
              style={{
                width: "100%",
              }}
            />
            {/* </React.Suspense> */}
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
            {activity?.description ? (
              <AdditionalDescription description={activity?.description} />
            ) : null}
            {durationHours || durationMinutes ? (
              <ActivityDuration
                duration={`${durationHours} hours, ${durationMinutes} minutes`}
              />
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
