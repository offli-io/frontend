import PlaceIcon from "@mui/icons-material/Place";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  changeActivityParticipantStatus,
  removePersonFromActivity,
} from "../../api/activities/requests";
import { LocationContext } from "../../app/providers/location-provider";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivityCard from "../../components/activity-card";
import MyActivityCard from "../../components/my-activity-card";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import { useActivities } from "../../hooks/use-activities";
import { useParticipantActivities } from "../../hooks/use-participant-activities";
import { useUser } from "../../hooks/use-user";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import { IActivity } from "../../types/activities/activity.dto";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ActivityActions from "./components/activity-actions";
import ActivityLeaveConfirmation from "./components/activity-leave-confirmation";
import FirstTimeLoginContent from "./components/first-time-login-content";
import { SetLocationContent } from "./components/set-location-content";

const ActivitiesScreen = () => {
  const { userInfo, isFirstTimeLogin, setIsFirstTimeLogin } = React.useContext(
    AuthenticationContext
  );
  const { location, setLocation } = React.useContext(LocationContext);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const { palette } = useTheme();

  //TODO either call it like this or set user info once useUsers request in layout.tsx got Promise resolved
  const { data: { data: userData = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const { data: { data: { activities = [] } = {} } = {}, isLoading } =
    useActivities<IActivityListRestDto>();

  const {
    data: { data = {} } = {},
    isLoading: areParticipantActivitiesLoading,
    invalidate: invalidateParticipantActivities,
  } = useParticipantActivities({ participantId: userInfo?.id });

  const participantActivites = data?.activities ?? [];

  const filteredActivities = activities?.filter(
    (activity) =>
      !participantActivites?.some(
        (participantActivity) => participantActivity?.id === activity?.id
      )
  );

  const { mutate: sendJoinActivity } = useMutation(
    ["invite-person"],
    (activityId?: number) => {
      const {
        id = undefined,
        name = undefined,
        username = undefined,
        profile_photo_url = undefined,
      } = { ...userData };
      return changeActivityParticipantStatus(Number(activityId), {
        id: Number(id),
        name,
        username,
        status: ActivityInviteStateEnum.CONFIRMED,
        profile_photo_url,
      });
    },

    {
      onSuccess: (data, buddy) => {
        enqueueSnackbar("You have successfully joined the activity", {
          variant: "success",
        });
        invalidateParticipantActivities();
        queryClient.invalidateQueries(["activities"]);
        hideDrawer();
      },
      onError: (error) => {
        enqueueSnackbar("Failed to join selected activity", {
          variant: "error",
        });
      },
    }
  );

  const hideDrawer = React.useCallback(() => {
    return toggleDrawer({
      open: false,
      content: undefined,
    });
  }, [toggleDrawer]);

  const { mutate: sendLeaveActivity } = useMutation(
    ["leave-activity"],
    (activityId?: number) =>
      removePersonFromActivity({ activityId, personId: userInfo?.id }),
    {
      onSuccess: () => {
        hideDrawer();
        //TODO add generic jnaming for activites / activity
        queryClient.invalidateQueries(["activity"]);
        queryClient.invalidateQueries(["activities"]);
        //invalidate queries
        //TODO display success notification?
      },
      onError: () => {
        enqueueSnackbar("Failed to leave activity", { variant: "error" });
      },
    }
  );

  const handleActionClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto, activityId?: number) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(
            `${ApplicationLocations.ACTIVITY_MEMBERS}/${activityId}`,
            {
              state: {
                from: ApplicationLocations.ACTIVITIES,
              },
            }
          );
        case ActivityActionsTypeEnumDto.LEAVE:
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={activityId}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendLeaveActivity}
              />
            ),
          });
        case ActivityActionsTypeEnumDto.MORE_INFORMATION:
          return navigate(
            `${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`,
            {
              state: {
                from: ApplicationLocations.ACTIVITIES,
              },
            }
          );
        case ActivityActionsTypeEnumDto.MAP:
          return navigate(`${ApplicationLocations.MAP}/${activityId}`, {
            state: {
              from: ApplicationLocations.ACTIVITIES,
            },
          });
        case ActivityActionsTypeEnumDto.JOIN:
          return sendJoinActivity(activityId);
        default:
          return console.log(action);
      }
    },
    []
  );

  const openActivityActions = React.useCallback(
    (activity?: IActivity) =>
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            onActionClick={handleActionClick}
            activity={activity}
          />
        ),
      }),
    [toggleDrawer]
  );

  React.useEffect(() => {
    //TODO is this fast enough isn't it flickering? Should I hide drawer before redirecting?
    return () =>
      toggleDrawer({
        open: false,
      });
  }, [toggleDrawer]);

  const anyMyActivities = React.useMemo(
    () => participantActivites?.length > 0,
    [participantActivites]
  );

  const anyNearYouActivities = React.useMemo(
    () => filteredActivities?.length > 0,
    [filteredActivities]
  );

  console.log(process.env.REACT_APP_API_URL);

  const handleLocationSelect = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: (
        <SetLocationContent
          onLocationSelect={(location) => {
            toggleDrawer({ open: false, content: undefined });
            setLocation?.(location);
          }}
          externalLocation={location}
        />
      ),
      // onClose: () => setIsFirstTimeLogin?.(false),
    });
  }, [location]);

  React.useEffect(() => {
    Boolean(isFirstTimeLogin) &&
      toggleDrawer({
        open: true,
        content: <FirstTimeLoginContent />,
        onClose: () => setIsFirstTimeLogin?.(false),
      });
  }, [isFirstTimeLogin, toggleDrawer]);

  return (
    <PageWrapper sxOverrides={{ px: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 1,
        }}
      >
        <Typography variant="h5" sx={{ color: palette?.text?.primary }}>
          Explore
        </Typography>
        <OffliButton
          variant="text"
          sx={{
            fontSize: 16,
            maxWidth: 200,
            justifyContent: "flex-start",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
          startIcon={<PlaceIcon sx={{ fontSize: "1.4rem", mr: -0.5 }} />}
          onClick={handleLocationSelect}
          data-test-id="current-location-btn"
        >
          {location?.name ?? "No location found"}
        </OffliButton>
      </Box>
      {/* {TODO Outsource autocomplete} */}
      <Autocomplete
        options={[]}
        forcePopupIcon={false}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mb: 1,
          "& .MuiOutlinedInput-root": {
            pr: 0,
          },
        }}
        //loading={placeQuery?.isLoading}
        // isOptionEqualToValue={(option, value) => option.id === value.id}
        onFocus={() =>
          navigate(ApplicationLocations.SEARCH, {
            state: {
              from: ApplicationLocations.ACTIVITIES,
            },
          })
        }
        onBlur={() => setIsSearchFocused(false)}
        // getOptionLabel={(option) => option?.display_name}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="What kind of activity are you looking for?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1.5rem", color: "#4A148C" }} />{" "}
                </InputAdornment>
              ),
            }}
            sx={{
              "& input::placeholder": {
                fontSize: 14,
                color: "#4A148C",
                fontWeight: 400,
                opacity: 1,
                pl: 1,
              },
              "& fieldset": { border: "none" },
              backgroundColor: ({ palette }) => palette?.primary?.light,
              borderRadius: "10px",
            }}
            data-testid="activities-search-input"
            // onChange={(e) => setValue("placeQuery", e.target.value)}
          />
        )}
      />
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {!anyMyActivities && !anyNearYouActivities && (
            <Typography
              variant="h4"
              sx={{ my: 6, color: palette?.text?.primary }}
            >
              There are no activities
            </Typography>
          )}
          {anyMyActivities && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mb: 1.5,
                  mt: 1,
                }}
              >
                <Typography variant="h5" sx={{ color: palette?.text?.primary }}>
                  Your upcoming this week
                </Typography>
                {/* <OffliButton
                  variant="text"
                  sx={{ fontSize: 16 }}
                  data-testid="see-all-activities-btn"
                >
                  See all
                </OffliButton> */}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "scroll",
                  width: "100%",
                  "::-webkit-scrollbar": { display: "none" },
                }}
              >
                {participantActivites?.map((activity) => {
                  return (
                    <MyActivityCard
                      key={activity?.id}
                      activity={activity}
                      onPress={openActivityActions}
                      sx={{
                        minWidth:
                          participantActivites?.length <= 1 ? "100%" : "80%",
                      }}
                    />
                  );
                })}
              </Box>
            </>
          )}
          {anyNearYouActivities && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h5" sx={{ color: palette?.text?.primary }}>
                  Near you
                </Typography>
                <OffliButton
                  variant="text"
                  sx={{ fontSize: 16 }}
                  onClick={() =>
                    navigate(ApplicationLocations.MAP, {
                      state: {
                        from: ApplicationLocations.ACTIVITIES,
                      },
                    })
                  }
                  data-testid="see-map-btn"
                >
                  Show on Map
                </OffliButton>
              </Box>
              <Box
                sx={{
                  // height: "100vh",
                  width: "100vw",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {filteredActivities?.map((activity) => {
                  return (
                    <ActivityCard
                      key={activity?.id}
                      activity={activity}
                      onPress={openActivityActions}
                    />
                  );
                })}
              </Box>
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default ActivitiesScreen;
