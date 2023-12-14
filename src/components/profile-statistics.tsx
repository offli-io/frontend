import AddRoundedIcon from "@mui/icons-material/AddRounded";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OffliButton from "./offli-button";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import { IPersonExtended } from "types/activities/activity.dto";
import { useUser } from "hooks/use-user";
import { AuthenticationContext } from "assets/theme/authentication-provider";

interface IProps {
  participatedNum?: number;
  createdNum?: number;
  metNum?: number;
  user?: IPersonExtended;
  isLoading?: boolean;
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  createdNum,
  metNum,
  isLoading,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = React.useContext(AuthenticationContext);
  const user = useUser({
    id: id ? Number(id) : userInfo?.id,
    requestingInfoUserId: id ? userInfo?.id : undefined,
  });

  const username = user?.data?.data?.username;

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
              mb: metNum ? 1 : 2,
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
                {id ? `${username} participated` : "You participated"} in{" "}
                <b>
                  {participatedNum}{" "}
                  {participatedNum === 1 ? "activity" : "activities"}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {id ? (
                  <Typography variant="subtitle2">
                    {username} hasn't joined any activities.
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="subtitle2">
                      No activities joined?
                    </Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0 }}
                      onClick={() => navigate(ApplicationLocations.EXPLORE)}
                    >
                      Find exciting options!
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: metNum ? 1 : 2,
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
                {id ? `${username} created` : "You created"}{" "}
                <b>
                  {createdNum} {createdNum === 1 ? "activity" : "activities"}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {id ? (
                  <Typography variant="subtitle2">
                    {username} hasn't organized any activities.
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="subtitle2">
                      You haven't created any activities.
                    </Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0 }}
                      onClick={() => navigate(ApplicationLocations.CREATE)}
                    >
                      Organize something fun!
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: metNum ? 1 : 2,
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
                {id ? `${username} has met` : "You've met"}{" "}
                <b>
                  {createdNum} {createdNum === 1 ? "new buddy" : "new buddies"}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                {id ? (
                  <Typography variant="subtitle2">
                    {username} hasn't made any new buddies.
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="subtitle2">No new buddies?</Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0 }}
                      onClick={() => navigate(ApplicationLocations.BUDDIES)}
                    >
                      Make new connections!
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileStatistics;
