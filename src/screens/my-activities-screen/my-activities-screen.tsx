import React from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MyActivityCard from "../../components/my-activity-card";
import { PageWrapper } from "../../components/page-wrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePersonFromActivity } from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivityActions from "./components/activity-actions";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { useNavigate } from "react-router-dom";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ActivityLeaveConfirmation from "./components/activity-leave-confirmation";
import { useSnackbar } from "notistack";
import { useActivities } from "../../hooks/use-activities";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import Map from "../../components/map";
import ActivityCard from "../../components/activity-card";
import OffliButton from "../../components/offli-button";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";

const ActivitiesScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const { data: { data: { activities = [] } = {} } = {}, isLoading } =
    useActivities<IActivityListRestDto>();

  const myActivities = React.useMemo(
    () =>
      activities?.filter((activity) => activity.creator?.id === userInfo?.id),
    [activities, userInfo]
  );

  const otherActivities = React.useMemo(
    () =>
      activities?.filter((activity) => activity.creator?.id !== userInfo?.id),
    [activities, userInfo]
  );

  const hideDrawer = React.useCallback(() => {
    return toggleDrawer({
      open: false,
      content: undefined,
    });
  }, [toggleDrawer]);

  const { mutate: sendLeaveActivity } = useMutation(
    ["leave-activity"],
    (activityId?: string) =>
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
    (action?: ActivityActionsTypeEnumDto, activityId?: string) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(
            `${ApplicationLocations.ACTIVITY_ID}/${activityId}/members`
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
          return navigate(`${ApplicationLocations.ACTIVITY_ID}/${activityId}`);
        default:
          return console.log(action);
      }
    },
    []
  );

  const openActivityActions = React.useCallback(
    (activityId?: string) =>
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            onActionClick={handleActionClick}
            activityId={activityId}
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
        <Typography variant="h5">Explore</Typography>
        <OffliButton
          variant="text"
          sx={{ fontSize: 16 }}
          startIcon={<PlaceIcon sx={{ fontSize: "1.4rem" }} />}
        >
          Bratislava
        </OffliButton>
      </Box>
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
        onChange={(e, locationObject) => console.log(locationObject)}
        onFocus={() => navigate(ApplicationLocations.SEARCH)}
        onBlur={() => setIsSearchFocused(false)}
        // getOptionLabel={(option) => option?.display_name}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="What kind of activity are you looking for?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1.2rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& input::placeholder": {
                fontSize: 14,
              },
            }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mb: 1,
            }}
          >
            <Typography variant="h5">Your upcoming this week</Typography>
            <OffliButton variant="text" sx={{ fontSize: 16 }}>
              See all
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
            {myActivities?.slice(0, 2)?.map((activity) => {
              return (
                <MyActivityCard
                  key={activity?.id}
                  activity={activity}
                  onLongPress={openActivityActions}
                  onPress={openActivityActions}
                />
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h5">Near you</Typography>
            <OffliButton
              variant="text"
              sx={{ fontSize: 16 }}
              onClick={() => navigate(ApplicationLocations.MAP)}
            >
              See map
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
            {otherActivities?.map((activity) => {
              return (
                <ActivityCard
                  key={activity?.id}
                  activity={activity}
                  onLongPress={openActivityActions}
                  onPress={openActivityActions}
                />
              );
            })}
          </Box>
        </>
      )}
    </PageWrapper>
  );
};

export default ActivitiesScreen;
