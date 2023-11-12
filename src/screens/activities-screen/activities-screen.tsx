import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { LocationContext } from "app/providers/location-provider";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivitySearchCard from "../../components/activity-search-card";
import {
  PAGED_ACTIVITIES_QUERY_KEY,
  useActivities,
} from "../../hooks/use-activities";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { TabDefinitionsEnum } from "./utils/tab-definitions";
import { useSwipeable } from "react-swipeable";
import {
  SWIPE_ARRAY_ORDER,
  detectSwipedTab,
} from "./utils/detect-swiped-tab.util";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getActivitiesPromiseResolved } from "api/activities/requests";
import { ACTIVITES_LIMIT } from "utils/common-constants";
import { AuthenticationContext } from "assets/theme/authentication-provider";
import { ActivitiyParticipantStatusEnum } from "types/activities/activity-participant-status-enum.dto";
import {
  ActivitySortColumnEnum,
  ActivitySortDirectionEnum,
} from "types/activities/activity-sort-enum.dto";
import InfiniteScroll from "react-infinite-scroller";
import Loader from "components/loader";
import ActivityCard from "components/activity-card";
import { LayoutContext } from "app/layout";

const ActivitiesScreen = () => {
  const navigate = useNavigate();
  // const history = useHistory()
  const location = useLocation();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const [currentTab, setCurrentTab] = React.useState<TabDefinitionsEnum>(
    TabDefinitionsEnum.UPCOMING
  );
  const { userInfo } = React.useContext(AuthenticationContext);
  const { setSwipeHandlers } = React.useContext(LayoutContext);

  React.useEffect(() => {
    setSwipeHandlers?.({
      left: () => {
        const nextTab = detectSwipedTab("left", currentTab);
        setCurrentTab(nextTab);
      },
      right: () => {
        const nextTab = detectSwipedTab("right", currentTab);
        setCurrentTab(nextTab);
      },
    });
  }, [currentTab]);

  const cachedTodaysDate = React.useMemo(() => new Date(), []);

  const {
    data: paginatedActivitiesData,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    [PAGED_ACTIVITIES_QUERY_KEY, location, currentTab],
    ({ pageParam = 0 }) =>
      getActivitiesPromiseResolved({
        offset: pageParam,
        limit: ACTIVITES_LIMIT,
        participantId: Number(userInfo?.id),
        participantStatus: ActivitiyParticipantStatusEnum.CONFIRMED,
        ...(currentTab === TabDefinitionsEnum.INVITED
          ? { participantStatus: ActivitiyParticipantStatusEnum.INVITED }
          : {}),
        ...(currentTab === TabDefinitionsEnum.UPCOMING
          ? { datetimeFrom: cachedTodaysDate }
          : {}),
        ...(currentTab === TabDefinitionsEnum.PAST
          ? {
              datetimeUntil: cachedTodaysDate,
              sort: `${ActivitySortColumnEnum.DATETIME_FROM}:${ActivitySortDirectionEnum.DESC}`,
            }
          : {}),
        ...(currentTab === TabDefinitionsEnum.CREATED
          ? {
              creatorId: Number(userInfo?.id),
            }
          : {}),
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
    }
  );

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: TabDefinitionsEnum
  ) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mt: 1, mx: 1, p: 0 }}
      >
        {SWIPE_ARRAY_ORDER.map((item) => (
          <Tab label={item} value={item} />
        ))}
      </Tabs>
      {isLoading ? <Loader /> : null}
      {!isLoading && paginatedActivitiesData?.pages?.[0]?.length === 0 ? (
        <Typography variant="subtitle2" sx={{ mt: 4, textAlign: "center" }}>
          There are no activities
        </Typography>
      ) : null}
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
                  // onLongPress={openActivityActions}
                  sx={{ mx: 0, my: 3, width: "100%" }}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      </InfiniteScroll>
    </>
  );
};

export default ActivitiesScreen;
