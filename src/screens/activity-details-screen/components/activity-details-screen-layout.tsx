import { Box, Typography } from "@mui/material";
import React from "react";
import BackHeader from "../../../components/back-header";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActivityDetailsGrid from "../components/activity-details-grid";
import ActivityDescriptionTags from "../components/activity-description-tags";
import ActivityCreatorDuration from "../components/activity-creator-duration";
import { IActivity } from "../../../types/activities/activity.dto";

interface IProps {
  activity: IActivity | undefined;
}

const ActivityDetailsScreenLayout: React.FC<IProps> = ({ activity }) => {
  return (
    <>
      {/* <PageWrapper> */}
      {/* {activity ? ( */}
      <Box
        sx={{
          width: "100%",
          height: "50%",
          backgroundImage: `url(${require("../../../assets/img/dune.webp")})`,
          // backgroundImage: `url(${activity?.title_picture})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          // backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${require("../assets/img/dune.webp")});`,
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 88%, transparent 100%)",
        }}
      ></Box>
      <Box
        sx={{
          width: "93%",
          margin: "auto",
        }}
      >
        <Typography variant="h2" align="left">
          {activity?.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          <Typography variant="h5" align="left">
            Basic Information
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "grey",
            }}
          >
            {activity?.visibility === "private" ? (
              <>
                <LockIcon sx={{ fontSize: "18px", mr: 0.5 }} />
                <Typography variant="subtitle1" align="left">
                  Private
                </Typography>
              </>
            ) : (
              <>
                <LockOpenIcon sx={{ fontSize: "18px", mr: 0.5 }} />
                <Typography variant="subtitle1" align="left">
                  Public
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <ActivityDetailsGrid activity={activity} />
        <ActivityDescriptionTags
          description={activity?.description}
          tags={activity?.tags!}
        />
        <ActivityCreatorDuration
          creator={activity?.creator}
          // duration={activity?.tags!}
          duration="3 hours"
          createdDateTime="22.01.2023 5:16 PM"
        />
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <Box>
            <Typography variant="h5" align="left" sx={{ fontSize: "14px" }}>
              Activity Creator
            </Typography>
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ fontSize: "11px" }}
            >
              {activity?.creator?.name}
            </Typography>
          </Box>
          <Box>sdsdsd</Box>
        </Box> */}
      </Box>

      {/* ) : null} */}
      {/* </PageWrapper> */}
    </>
  );
};

export default ActivityDetailsScreenLayout;
