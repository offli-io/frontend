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
        dateTime={activity?.datetime_from?.toString()}
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
          width: "100%",
          height: "20%",
        }}
      />
      <BasicInformation
        locationName={activity?.location?.name}
        dateTime={activity?.datetime_from?.toLocaleString("en-GB", {
          timeZone: "UTC",
        })}
        price={activity?.price}
        participantsNum={participantsNum}
      />
      <AdditionalDescription />
    </MainBox>
  );
};

export default MapDrawerDetail;
