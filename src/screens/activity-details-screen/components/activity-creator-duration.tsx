import { Typography, Box, Chip } from "@mui/material";
import React from "react";
import { IPerson } from "../../../types/activities/activity.dto";
import userPlaceholder from "../../../assets/img/user-placeholder.svg";

interface IProps {
  creator?: IPerson;
  duration?: string;
  createdDateTime?: string;
}

const ActivityCreatorDuration: React.FC<IProps> = ({
  creator,
  duration,
  createdDateTime,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mt: 3,
          px: 1,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            align="left"
            sx={{ fontSize: "14px", mb: 0.5 }}
          >
            Activity Creator
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <img
              src={creator?.profile_photo_url ?? userPlaceholder}
              alt="profile"
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ fontSize: "11px", ml: 0.3 }}
            >
              {creator?.username}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            align="left"
            sx={{ fontSize: "14px", mb: 0.5 }}
          >
            Duration
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ fontSize: "11px" }}
            >
              {duration}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ fontSize: "12px", mb: 1, color: "grey" }}
      >
        Created {createdDateTime}
      </Typography>
    </>
  );
};

export default ActivityCreatorDuration;
