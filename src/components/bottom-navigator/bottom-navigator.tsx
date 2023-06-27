import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Box, Paper, SxProps, useTheme } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  acceptActivityInvitation,
  sendBuddyRequest,
} from "../../api/activities/requests";
import { acceptBuddyInvitation } from "../../api/users/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { HEADER_HEIGHT } from "../../utils/common-constants";
import OffliButton from "../offli-button";
import { mapLocationToNavigatorValue } from "./utils/map-location-to-navigator-value.util";

interface IBottomNavigatorProps {
  sx?: SxProps;
}

const BottomNavigator: React.FC<IBottomNavigatorProps> = ({ sx }) => {
  const { palette } = useTheme();
  const [value, setValue] = React.useState<ApplicationLocations>(
    ApplicationLocations.ACTIVITIES
  );
  const [isActionRequired, setIsActionRequired] = React.useState(false);
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const paramsArray = location?.pathname.split("/");
  const id = paramsArray[paramsArray.length - 1];
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const isBuddyRequest = location?.pathname?.includes("/profile/request");
  const isUserProfile = location?.pathname?.includes("/profile/user");
  const isActivityRequest = location?.pathname?.includes("/activity/request");

  React.useEffect(() => {
    setValue(location?.pathname as ApplicationLocations);
    if (location?.pathname.includes("/request") || isUserProfile) {
      setIsActionRequired(true);
    } else {
      setIsActionRequired(false);
    }
  }, [location]);

  const { mutate: sendAcceptBuddyRequest } = useMutation(
    ["accept-buddy-request"],
    () => acceptBuddyInvitation(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        queryClient.invalidateQueries(["notifications"]);
        enqueueSnackbar("User was successfully confirmed as your buddy", {
          variant: "success",
        });
        navigate(ApplicationLocations.NOTIFICATIONS);
      },
      onError: () => {
        queryClient.invalidateQueries(["notifications"]);

        enqueueSnackbar("Failed to accept buddy request", {
          variant: "error",
        });
      },
    }
  );

  const { mutate: sendAcceptActivityInvitation } = useMutation(
    ["accept-buddy-request"],
    () => acceptActivityInvitation(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        queryClient.invalidateQueries(["notifications"]);
        enqueueSnackbar("You have successfully joined the activity", {
          variant: "success",
        });
        navigate(ApplicationLocations.NOTIFICATIONS);
      },
      onError: () => {
        enqueueSnackbar("Failed to join activity", {
          variant: "error",
        });
      },
    }
  );

  const { mutate: sendSubmitBuddyRequest } = useMutation(
    ["send-buddy-request"],
    () => sendBuddyRequest(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        // queryClient.invalidateQueries(["notifications"]);
        enqueueSnackbar("Buddy request successfully sent", {
          variant: "success",
        });
        navigate(ApplicationLocations.ADD_BUDDIES);
      },
      onError: () => {
        enqueueSnackbar("Failed to send buddy request", {
          variant: "error",
        });
      },
    }
  );

  const acceptInvitation = React.useCallback(() => {
    if (isBuddyRequest) {
      return sendAcceptBuddyRequest();
    }
    if (isActivityRequest) {
      return sendAcceptActivityInvitation();
    }
    return;
  }, [isBuddyRequest, isActivityRequest]);

  const declineInvitation = React.useCallback(() => {
    if (isBuddyRequest) {
      return sendAcceptBuddyRequest();
    }
    if (isActivityRequest) {
      return;
    }
    return;
  }, [isBuddyRequest, isActivityRequest]);

  const submitBuddyRequest = React.useCallback(() => {
    sendSubmitBuddyRequest();
  }, [sendSubmitBuddyRequest]);

  return (
    <Paper
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: HEADER_HEIGHT,
        ...(isActionRequired && {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
        bgcolor: palette?.background?.default,

        // boxShadow: 15,
      }}
      //TODO either Box with boxShadow as sx or Paper with elevation 3 - need to compare
      // sx={sx}
      elevation={3}
    >
      {isActionRequired ? (
        <>
          {isBuddyRequest && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <OffliButton
                sx={{ width: "30%", fontSize: 16 }}
                variant="outlined"
                onClick={declineInvitation}
                data-testid="reject-invitation-btn"
              >
                Reject
              </OffliButton>
              <OffliButton
                sx={{ width: "50%", fontSize: 16 }}
                onClick={acceptInvitation}
                data-testid="accept-invitation-btn"
              >
                Accept
              </OffliButton>
            </Box>
          )}
          {isUserProfile && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <OffliButton
                onClick={submitBuddyRequest}
                data-testid="send-buddy-request-btn"
              >
                Send buddy request
              </OffliButton>
            </Box>
          )}
        </>
      ) : (
        <BottomNavigation
          showLabels
          value={mapLocationToNavigatorValue(value)}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            margin: "auto",
            "& .Mui-selected": {
              fontSize: "12px !important",
            },
            color: palette?.background?.default,
            bgcolor: palette?.background?.default,
          }}
          data-testid="bottom-navigator"
        >
          <BottomNavigationAction
            label="Explore"
            icon={<TravelExploreIcon />}
            component={Link}
            value={ApplicationLocations.ACTIVITIES}
            to={ApplicationLocations.ACTIVITIES}
            data-testid="navigator-activities"
          />
          <BottomNavigationAction
            label="Create"
            icon={<AddCircleOutlineIcon />}
            component={Link}
            value={ApplicationLocations.CREATE}
            to={ApplicationLocations.CREATE}
            data-testid="navigator-create"
          />
          <BottomNavigationAction
            label="Profile"
            icon={<AccountCircleOutlinedIcon />}
            component={Link}
            value={ApplicationLocations.PROFILE}
            to={ApplicationLocations.PROFILE}
            data-testid="navigator-profile"
          />
        </BottomNavigation>
      )}
    </Paper>
  );
};

export default BottomNavigator;
