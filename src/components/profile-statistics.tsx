import AddRoundedIcon from "@mui/icons-material/AddRounded";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

interface IProps {
  participatedNum?: number;
  createdNum?: number;
  metNum?: number;
  user?:string;
  isLoading?: boolean;
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  createdNum,
  metNum,
  user,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb:metNum ? 1:2
            }}
            data-testid="participated-statistics"
          >
            <IconButton>
              <OfflineBoltIcon
                sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
              />
            </IconButton>
            {participatedNum ? (
              <Typography variant="subtitle2">
                {id ? `${user} participated` : "You participated"} in{" "}
                <b>
                  {participatedNum}{" "}
                  {participatedNum === 1 ? "activity" : "activities"}
                </b>
                .
              </Typography>              
            ) : (
              <Typography variant="subtitle2">
                {id ?  `${user} haven't joined any activities.` : 
                "No activities joined? Make the most of your time by joining others!"} 
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb:metNum ? 1:2
            }}
            data-testid="created-statistics"
          >
            <IconButton>
              <AddRoundedIcon
                sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
              />
            </IconButton>
            {createdNum ? (
              <Typography variant="subtitle2">
                {id ? `${user} created` : "You created"}{" "}
                <b>
                  {createdNum}{" "}
                  {createdNum === 1 ? "activity" : "activities"}
                </b>
                .
              </Typography>
            ) : (            
              <Typography variant="subtitle2">
                {id ?  `${user} haven't organized any activities.` : 
                "You haven't created any activities. Get creative and organize something fun!"}
              </Typography>
            )}
          </Box>          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb:metNum ? 1:2
            }}
            data-testid="new-buddies-statistics"
          >
            <IconButton>
              <PeopleAltIcon
                sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
              />
            </IconButton>
            {metNum ? (
              <Typography variant="subtitle2">
                {id ? `${user} has met` : "You've met"}{" "}
                <b>
                  {createdNum}{" "}
                  {createdNum === 1 ? "new buddy" : "new buddies"}
                </b>
                .
              </Typography>            
            ) : (            
              <Typography variant="subtitle2">
                {id ?  `${user} haven't made any new friends.` : 
                "No new buddies? Expand your circle and make new connections."}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileStatistics;
