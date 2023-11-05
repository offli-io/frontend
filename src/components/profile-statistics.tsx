import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import activitiesAttendedPicture from "../assets/img/activities-attended.svg";
import enjoyedTimeTogetherPicture from "../assets/img/enjoyed-time-together.svg";

interface IProps {
  participatedNum?: number;
  enjoyedNum?: number;
  createdNum?: number;
  metNum?: number;
  isLoading?: boolean;
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  enjoyedNum,
  createdNum,
  metNum,
  isLoading,
}) => {
  const { id } = useParams();
  return id ? (
    <Box sx={{ width: "100%", mb: 2 }}>
      {participatedNum && participatedNum > 0 ? (
        // {TODO Outsource this image statistic into separate component}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 100,
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              alt="activities_attended"
              src={activitiesAttendedPicture}
              style={{ height: 65 }}
            />
          </Box>
          <Box>
            <Box sx={{ display: "flex" }}>
              <OfflineBoltIcon sx={{ color: "primary.main" }} />
              <Typography
                sx={{
                  fontWeight: "bold",
                  ml: 1,
                  color: ({ palette }) => palette?.primary?.main,
                }}
              >
                {participatedNum}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: ({ palette }) => palette?.primary?.main,
              }}
            >
              activities attended
            </Typography>
          </Box>
        </Box>
      ) : null}
      {enjoyedNum && enjoyedNum > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: 100,
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              alt="activities_attended"
              src={enjoyedTimeTogetherPicture}
              style={{ height: 65 }}
            />
          </Box>
          <Box>
            <Box sx={{ display: "flex" }}>
              <FavoriteIcon sx={{ color: "primary.main" }} />
              <Typography
                sx={{
                  fontWeight: "bold",
                  ml: 1,
                  color: ({ palette }) => palette?.primary?.main,
                }}
              >
                {enjoyedNum}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: ({ palette }) => palette?.primary?.main,
              }}
            >
              activities enjoyed
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  ) : (
    <Box
      sx={{
        width: "100%",
        mt: 2,

      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 2,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {participatedNum ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="participated-statistics"
              >
                <IconButton>
                  <OfflineBoltIcon
                    sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
                  />
                </IconButton>
                <Typography variant="subtitle2">
                  You participated in <b>{participatedNum} activities</b>.
                </Typography>
              </Box>
          ) : null}
          {enjoyedNum ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="enjoyed-statistics"
              >
                <IconButton>
                  <FavoriteIcon sx={{ fontSize: 30, color: "primary.main", mr: 2 }} />
                </IconButton>
                <Typography variant="subtitle1">
                <b>{enjoyedNum} people</b> enjoyed activities, you've created.
                </Typography>
              </Box>
          ) : null}
          {createdNum ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="created-statistics"
              >
                <IconButton>
                  <AddRoundedIcon sx={{ fontSize: 30, color: "primary.main", mr: 2  }}/>
                </IconButton>
                <Typography variant="subtitle2">
                  You created <b>{createdNum} activities</b>.
                </Typography>
              </Box>
          ) : null}
          {metNum ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                data-testid="new-buddies-statistics"
              >
                <IconButton>
                  <PeopleAltIcon sx={{ fontSize: 30, color: "primary.main", mr: 2  }} />
                </IconButton>
                <Typography variant="subtitle2">
                  You`ve met <b>{metNum}</b> new <b>{metNum === 1 ? "buddy" : "buddies"}</b>.
                </Typography>
              </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default ProfileStatistics;
