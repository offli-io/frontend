import React from "react";
import { useActivities } from "../../../hooks/use-activities";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";
import { Box, styled } from "@mui/system";
import { Typography } from "@mui/material";
import ActivityDetailTiles from "./activity-detail-tiles";
import ActivityTags from "../../activity-details-screen/components/activity-tags";
import { CreatorVisibilityRow } from "./creator-visibility-row";
import BasicInformation from "./basic-information";
import AdditionalDescription from "./additional-description";
import { getTimeDifference } from "../utils/get-time-difference";
import ActivityDuration from "./activity-duration";
import CreatedTimestamp from "./created-timestamp";

interface IProps {
  activityId?: number;
}

const MainBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 !important",
}));

const MapDrawerDetail: React.FC<IProps> = ({ activityId }) => {
  const { data: { data: { activity = {} } = {} } = {} } =
    useActivities<IActivityRestDto>({
      id: activityId,
    });

  const participantsNum = `${activity?.count_confirmed}/${activity?.limit}`;

  const timeStampFrom = Date.parse(activity?.datetime_from!.toString());
  const dateTimeFrom = new Date(timeStampFrom);
  const timeStampUntil = Date.parse(activity?.datetime_until!.toString());
  const dateTimeUntil = new Date(timeStampUntil);
  const timeStampCreatedAt = Date.parse(activity?.datetime_until!.toString());
  const dateTimeCreatedAt = new Date(timeStampCreatedAt);

  const { durationHours, durationMinutes } = getTimeDifference(
    dateTimeFrom,
    dateTimeUntil
  ); // useMemo??
  return (
    <MainBox>
      <Typography
        variant="h2"
        sx={{ maxWidth: "80%", textAlign: "center", flex: 1, mb: 1.5 }}
      >
        {activity?.title}
      </Typography>
      <ActivityDetailTiles
        participantsNum={participantsNum}
        dateTime={dateTimeFrom.toLocaleString("de", {
          timeStyle: "short",
        })}
        // distance={activity?.}
        price={activity?.price}
      />
      <ActivityTags tags={activity?.tags} />
      <CreatorVisibilityRow
        creator={activity?.creator}
        visibility={activity?.visibility}
      />
      <img
        src={activity?.title_picture_url}
        alt="activity_title_photo"
        style={{
          width: "100vw",
        }}
      />
      <BasicInformation
        locationName={activity?.location?.name}
        // dateTime={`${dateTimeFrom.toLocaleString("de", {
        //   hour12: false,
        //   dateStyle: "short",
        //   timeStyle: "short",
        // })}`}
        dateTime={`${dateTimeFrom?.toLocaleString("de", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })} - ${dateTimeUntil?.toLocaleString("de", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}`}
        price={activity?.price}
        participantsNum={participantsNum}
      />
      <AdditionalDescription description={activity?.description} />
      <ActivityDuration
        duration={`${durationHours} hours, ${durationMinutes} minutes`}
      />
      <CreatedTimestamp
        timestamp={`${dateTimeCreatedAt?.toLocaleString("de", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}`}
      />
    </MainBox>
  );
};

export default MapDrawerDetail;
