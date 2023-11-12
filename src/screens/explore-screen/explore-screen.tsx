import MapIcon from "@mui/icons-material/Map";
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
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Loader from "components/loader";
import { useDismissActivity } from "hooks/use-dismiss-activity";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ActivitySortColumnEnum } from "types/activities/activity-sort-enum.dto";
import {
  changeActivityParticipantStatus,
  getActivitiesPromiseResolved,
  removePersonFromActivity,
} from "../../api/activities/requests";
import { LocationContext } from "../../app/providers/location-provider";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivityCard from "../../components/activity-card";
import MyActivityCard from "../../components/my-activity-card";
import OffliButton from "../../components/offli-button";
import {
  ACTIVITIES_QUERY_KEY,
  PAGED_ACTIVITIES_QUERY_KEY,
} from "../../hooks/use-activities";
import {
  PARTICIPANT_ACTIVITIES_QUERY_KEY,
  useParticipantActivities,
} from "../../hooks/use-participant-activities";
import { useUser } from "../../hooks/use-user";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { IActivity } from "../../types/activities/activity.dto";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ActivityActions from "./components/activity-actions";
import ActivityLeaveConfirmation from "./components/activity-leave-confirmation";
import FirstTimeLoginContent from "./components/first-time-login-content";
import { SetLocationContent } from "./components/set-location-content";
import { addWeeks, addDays, isWithinInterval, startOfToday } from "date-fns";
import { ACTIVITES_LIMIT } from "utils/common-constants";
import { filterActivitiesForNext7Days } from "./utils/filter-activities-for-next-days";

const ExploreScreen = () => {
  const { userInfo, isFirstTimeLogin, setIsFirstTimeLogin } = React.useContext(
    AuthenticationContext
  );
  const { location, setLocation } = React.useContext(LocationContext);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const { sendDismissActivity, isLoading: isDismissingActivity } =
    useDismissActivity();

  //TODO either call it like this or set user info once useUsers request in layout.tsx got Promise resolved
  const { data: { data: userData = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const {
    data: paginatedActivitiesData,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [PAGED_ACTIVITIES_QUERY_KEY, location],
    ({ pageParam = 0 }) =>
      getActivitiesPromiseResolved({
        offset: pageParam,
        limit: ACTIVITES_LIMIT,
        lon: location?.coordinates?.lon,
        lat: location?.coordinates?.lat,
        participantId: Number(userInfo?.id),
        sort:
          location?.coordinates?.lon && location?.coordinates?.lat
            ? ActivitySortColumnEnum.LOCATION
            : undefined,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        // don't need to add +1 because we are indexing offset from 0 (so length will handle + 1)
        if (lastPage?.length === ACTIVITES_LIMIT) {
          const nextPage: number = allPages?.length;
          return nextPage;
        }

        return undefined;
      },
      enabled: !!userInfo?.id,
      select: (data) => ({
        pages: data?.pages?.map((page) =>
          page?.filter((activity) => activity?.participant_status === null)
        ),
        pageParams: [...data.pageParams],
      }),
    }
  );

  const {
    data: { data: { activities: participantActivites = [] } = {} } = {},
    isLoading: areParticipantActivitiesLoading,
    invalidate: invalidateParticipantActivities,
  } = useParticipantActivities({
    participantId: userInfo?.id,
    sort: ActivitySortColumnEnum.DATETIME_FROM,
  });

  const { mutate: sendJoinActivity } = useMutation(
    ["join-activity-response"],
    (activityId?: number) => {
      const { id = undefined } = { ...userData };
      return changeActivityParticipantStatus(Number(activityId), Number(id), {
        status: ActivityInviteStateEnum.CONFIRMED,
      });
    },

    {
      onSuccess: (data, buddy) => {
        toast.success("You have successfully joined the activity");
        invalidateParticipantActivities();
        queryClient.invalidateQueries(["activities"]);
        hideDrawer();
      },
      onError: (error) => {
        toast.error("Failed to join selected activity");
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
    ["leave-activity-response"],
    (activityId?: number) =>
      removePersonFromActivity({ activityId, personId: userInfo?.id }),
    {
      onSuccess: (data, activityId) => {
        hideDrawer();
        //TODO add generic jnaming for activites / activity
        queryClient.invalidateQueries(["activity", activityId]);
        queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

        //invalidate queries
        //TODO display success notification?
      },
      onError: () => {
        toast.error("Failed to leave activity");
      },
    }
  );

  const handleActionClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto, activityId?: number) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(
            `${ApplicationLocations.ACTIVITY_MEMBERS}/${activityId}`
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
            `${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`
          );
        case ActivityActionsTypeEnumDto.MAP:
          return navigate(`${ApplicationLocations.MAP}/${activityId}`);
        case ActivityActionsTypeEnumDto.JOIN:
          return sendJoinActivity(activityId);
        case ActivityActionsTypeEnumDto.EDIT:
          return navigate(
            `${ApplicationLocations.EDIT_ACTIVITY}/${activityId}`
          );
        case ActivityActionsTypeEnumDto.DISMISS:
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={Number(activityId)}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendDismissActivity}
                isLeaving={isDismissingActivity}
                type="dismiss"
              />
            ),
          });

        default:
          return console.log(action);
      }
    },
    []
  );

  const openActivityActions = React.useCallback(
    (activity?: IActivity) => {
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            onActionClick={handleActionClick}
            activity={activity}
          />
        ),
      });
    },
    [toggleDrawer]
  );

  const anyNearYouActivities = React.useMemo(
    () => paginatedActivitiesData?.pages?.some((page) => page?.length > 0),
    [paginatedActivitiesData]
  );

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
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 1,
        }}
      >
        <Typography variant="h4" sx={{ color: palette?.text?.primary }}>
          Explore
        </Typography>
        <OffliButton
          variant="text"
          sx={{
            fontSize: 16,
            justifyContent: "flex-end",
            width: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          startIcon={
            <PlaceIcon
              sx={{ fontSize: "1.4rem", mr: -0.5, color: "primary.main" }}
            />
          }
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
        onFocus={() => navigate(ApplicationLocations.SEARCH)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="What kind of activity are you looking for?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ fontSize: "1.5rem", color: "primary.main" }}
                  />{" "}
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
      {areParticipantActivitiesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {filterActivitiesForNext7Days(participantActivites).length < 1 &&
            !anyNearYouActivities && (
              <Typography
                variant="h4"
                sx={{ my: 6, color: palette?.text?.primary }}
              >
                There are no activities
              </Typography>
            )}

          {filterActivitiesForNext7Days(participantActivites).length > 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  my: 2,
                }}
              >
                <Typography variant="h4" sx={{ color: palette?.text?.primary }}>
                  Your upcoming in week
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                  overflowX: "scroll",
                  width: "100%",
                  "::-webkit-scrollbar": { display: "none" },
                }}
              >
                {filterActivitiesForNext7Days(participantActivites).map(
                  (activity) => {
                    return (
                      <MyActivityCard
                        key={activity?.id}
                        activity={activity}
                        type="explore"
                        onPress={() =>
                          navigate(
                            `${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`
                          )
                        }
                        onLongPress={openActivityActions}
                        sx={{
                          minWidth:
                            participantActivites?.length <= 1 ? "100%" : "80%",
                        }}
                      />
                    );
                  }
                )}
              </Box>
            </Box>
          )}
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mt: 2,
                mb: 1,
              }}
            >
              <Typography variant="h4" sx={{ color: palette?.text?.primary }}>
                Near you
              </Typography>
              <OffliButton
                variant="text"
                sx={{ fontSize: 16 }}
                startIcon={
                  <MapIcon
                    sx={{ fontSize: "1.2rem", ml: -0.7, color: "primary.main" }}
                  />
                }
                onClick={() => navigate(ApplicationLocations.MAP)}
                data-testid="see-map-btn"
              >
                Show map
              </OffliButton>
            </Box>
            <InfiniteScroll
              pageStart={0}
              loadMore={() =>
                !isFetchingNextPage &&
                [...(paginatedActivitiesData?.pages?.[0] ?? [])].length > 8 &&
                fetchNextPage()
              }
              hasMore={hasNextPage}
              loader={<Loader key={"loader"} />}
              useWindow={false}
            >
              <>
                {paginatedActivitiesData?.pages?.map((group, i) => (
                  <React.Fragment key={i}>
                    {group?.map((activity) => (
                      <ActivityCard
                        key={activity?.id}
                        activity={activity}
                        onPress={() =>
                          navigate(
                            `${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`
                          )
                        }
                        onLongPress={openActivityActions}
                        sx={{ mx: 0, my: 3, width: "100%" }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </>
            </InfiniteScroll>
          </>
        </>
      )}
    </>
  );
};

export default ExploreScreen;
