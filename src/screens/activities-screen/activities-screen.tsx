import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getActivitiesPromiseResolved } from 'api/activities/requests';
import { LayoutContext } from 'app/layout';
import ActivityCard from 'components/activity-card';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import Loader from 'components/loader';
import { PAGED_ACTIVITIES_QUERY_KEY } from 'hooks/use-activities-infinite-query';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ActivitiyParticipantStatusEnum } from 'types/activities/activity-participant-status-enum.dto';
import {
  ActivitySortColumnEnum,
  ActivitySortDirectionEnum
} from 'types/activities/activity-sort-enum.dto';
import { ACTIVITES_LIMIT } from 'utils/common-constants';
import { getScrollOffset, setScrollOffset } from 'utils/scoll-position-utils';
import AnimationDiv from '../../components/animation-div';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { ActivitiesTabLabelMap } from './utils/activities-tab-label-map';
import { SWIPE_ARRAY_ORDER, detectSwipedTab } from './utils/detect-swiped-tab.util';
import { TabDefinitionsEnum } from './utils/tab-definitions';

const ActivitiesScreen = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [currentTab, setCurrentTab] = React.useState<TabDefinitionsEnum>(
    TabDefinitionsEnum.UPCOMING
  );
  const scrollOffset = getScrollOffset();
  const { activeTab } = useParams();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { setSwipeHandlers, contentDivRef } = React.useContext(LayoutContext);

  React.useEffect(() => {
    setSwipeHandlers?.({
      left: () => {
        const nextTab = detectSwipedTab('left', currentTab);
        navigate(`${ApplicationLocations.ACTIVITIES}/${nextTab}`);
      },
      right: () => {
        const nextTab = detectSwipedTab('right', currentTab);
        navigate(`${ApplicationLocations.ACTIVITIES}/${nextTab}`);
      }
    });
  }, [currentTab]);

  React.useEffect(() => {
    return () => {
      // I need to reset swipe handlers when component is unmounted
      setSwipeHandlers?.(null);
    };
  }, []);

  React.useEffect(() => {
    setCurrentTab(activeTab as TabDefinitionsEnum);
  }, [activeTab]);

  const cachedTodaysDate = React.useMemo(() => new Date(), []);

  const {
    data: paginatedActivitiesData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery(
    [PAGED_ACTIVITIES_QUERY_KEY, pathname, currentTab],
    ({ pageParam = 0 }) =>
      getActivitiesPromiseResolved({
        offset: pageParam,
        limit: ACTIVITES_LIMIT,
        participantId: Number(userInfo?.id),
        participantStatus: ActivitiyParticipantStatusEnum.CONFIRMED,
        ...(currentTab === TabDefinitionsEnum.INVITED
          ? { participantStatus: ActivitiyParticipantStatusEnum.INVITED }
          : {}),
        ...(currentTab === TabDefinitionsEnum.UPCOMING ? { datetimeFrom: cachedTodaysDate } : {}),
        ...(currentTab === TabDefinitionsEnum.PAST
          ? {
              datetimeUntil: cachedTodaysDate,
              sort: `${ActivitySortColumnEnum.DATETIME_FROM}:${ActivitySortDirectionEnum.DESC}`
            }
          : {}),
        ...(currentTab === TabDefinitionsEnum.CREATED
          ? {
              creatorId: Number(userInfo?.id)
            }
          : {})
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        // don't need to add +1 because we are indexing offset from 0 (so length will handle + 1)
        if (lastPage?.length === ACTIVITES_LIMIT) {
          const nextPage: number = allPages?.length * ACTIVITES_LIMIT;
          return nextPage;
        }
        return undefined;
      },
      enabled: !!userInfo?.id
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabDefinitionsEnum) => {
    navigate(`${ApplicationLocations.ACTIVITIES}/${newValue}`);
    setScrollOffset(null);
  };

  const handleActivityCardClick = React.useCallback(
    (activityId?: number) => {
      setScrollOffset(contentDivRef?.current?.scrollTop);
      navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`);
    },
    [contentDivRef?.current]
  );

  React.useEffect(() => {
    if (scrollOffset && contentDivRef?.current) {
      contentDivRef.current.scrollTop = Number(scrollOffset);
    }
  }, [scrollOffset, contentDivRef?.current, paginatedActivitiesData]);

  React.useEffect(() => {
    // isFetchingNextPage is only one variable that I can rely on to reset activites offset
    if (isFetchingNextPage) {
      setScrollOffset(null);
    }
  }, [isFetchingNextPage]);

  return (
    <AnimationDiv style={{ paddingInline: 6 }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        // scrollButtons="auto"
        sx={{
          zIndex: 10,
          p: 0,
          ml: -1,
          width: '100%',
          maxWidth: 430,
          position: 'fixed',
          bgcolor: 'background.default',
          '& .MuiTab-root': {
            textTransform: 'capitalize',
            fontSize: 16
          }
        }}
        style={{ padding: 0 }}>
        {SWIPE_ARRAY_ORDER.map((item, index) => (
          <Tab
            data-testid={`my-activities-tab-${index}`}
            key={item}
            label={ActivitiesTabLabelMap[item]}
            value={item}
          />
        ))}
      </Tabs>
      <Box sx={{ pt: 4 }} />
      {isLoading ? <Loader /> : null}
      {!isLoading && paginatedActivitiesData?.pages?.[0]?.length === 0 ? (
        <Typography variant="subtitle2" sx={{ mt: 4, textAlign: 'center' }}>
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
        loader={<Loader key={'loader'} />}
        useWindow={false}>
        <>
          {paginatedActivitiesData?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group?.map((activity) => (
                <ActivityCard
                  key={activity?.id}
                  activity={activity}
                  onPress={() => handleActivityCardClick(activity?.id)}
                  // onLongPress={openActivityActions}
                  sx={{ mx: 0, my: 3, width: '100%' }}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      </InfiniteScroll>
    </AnimationDiv>
  );
};

export default ActivitiesScreen;
