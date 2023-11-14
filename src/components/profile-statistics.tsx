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
import AlternativePicturetatistics from "./alternative-picture-statistics";

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

  //this was used before when we used picture statistics on other profile
  // <AlternativePicturetatistics
  //   participatedNum={participatedNum}
  //   enjoyedNum={enjoyedNum}
  // />
  return (
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
                You participated in{" "}
                <b>
                  {participatedNum}{" "}
                  {participatedNum === 1 ? "activity" : "activities"}
                </b>
                .
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
                <FavoriteIcon
                  sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
                />
              </IconButton>
              <Typography variant="subtitle2">
                <b>{enjoyedNum} people</b> enjoyed activities,{" "}
                {id ? "he" : "you've"} created.
              </Typography>
            </Box>
          ) : null}
          {!id ? (
            <>
              {createdNum ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  data-testid="created-statistics"
                >
                  <IconButton>
                    <AddRoundedIcon
                      sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
                    />
                  </IconButton>
                  <Typography variant="subtitle2">
                    {id ? "Created" : "You created"}{" "}
                    <b>
                      {createdNum}{" "}
                      {createdNum === 1 ? "activity" : "activities"}
                    </b>
                    .
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
                    <PeopleAltIcon
                      sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
                    />
                  </IconButton>
                  <Typography variant="subtitle2">
                    You`ve met <b>{metNum}</b> new{" "}
                    <b>{metNum === 1 ? "buddy" : "buddies"}</b>.
                  </Typography>
                </Box>
              ) : null}
            </>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default ProfileStatistics;
