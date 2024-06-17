import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import { Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from 'components/loader';
import {
  PAGED_ACTIVITIES_QUERY_KEY,
  useActivitiesInfiniteQuery
} from 'hooks/use-activities-infinite-query';
import { useDismissActivity } from 'hooks/use-dismiss-activity';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  changeActivityParticipantStatus,
  removePersonFromActivity
} from '../../api/activities/requests';
import ActivityCard from '../../components/activity-card';
import AnimationDiv from '../../components/animation-div';
import { AuthenticationContext } from '../../components/context/providers/authentication-provider';
import { DrawerContext } from '../../components/context/providers/drawer-provider';
import { LocationContext } from '../../components/context/providers/location-provider';
import OffliButton from '../../components/offli-button';
import { ACTIVITIES_QUERY_KEY } from '../../hooks/use-activities';
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from '../../hooks/use-participant-activities';
import { useUser } from '../../hooks/use-user';
import { ActivityInviteStateEnum } from '../../types/activities/activity-invite-state-enum.dto';
import { IActivity } from '../../types/activities/activity.dto';
import { ActivityActionsTypeEnumDto } from '../../types/common/activity-actions-type-enum.dto';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import ActivityActions from './components/activity-actions';
import ActivityLeaveConfirmation from './components/activity-leave-confirmation';
import FirstTimeLoginContent from './components/first-time-login-content';
import Searchbar from './components/searchbar';
import { SetLocationContent } from './components/set-location-content';

const ExploreScreen = () => {
  const { userInfo, isFirstTimeLogin, setIsFirstTimeLogin } =
    React.useContext(AuthenticationContext);
  const { location, setLocation } = React.useContext(LocationContext);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sendDismissActivity, isLoading: isDismissingActivity } = useDismissActivity();

  //TODO either call it like this or set user info once useUsers request in layout.tsx got Promise resolved
  const { data: { data: userData = {} } = {} } = useUser({
    id: userInfo?.id
  });

  const { pages, isFetchingNextPage, fetchNextPage, hasNextPage } = useActivitiesInfiniteQuery();

  const { mutate: sendJoinActivity } = useMutation(
    ['join-activity-response'],
    (activityId?: number) => {
      const { id = undefined } = { ...userData };
      return changeActivityParticipantStatus(Number(activityId), Number(id), {
        status: ActivityInviteStateEnum.CONFIRMED
      });
    },

    {
      onSuccess: () => {
        toast.success('You have successfully joined the activity');
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries(['activities']);

        hideDrawer();
      },
      onError: () => {
        toast.error('Failed to join selected activity');
      }
    }
  );

  const hideDrawer = React.useCallback(() => {
    return toggleDrawer({
      open: false,
      content: undefined
    });
  }, [toggleDrawer]);

  const { mutate: sendLeaveActivity } = useMutation(
    ['leave-activity-response'],
    (activityId?: number) => removePersonFromActivity({ activityId, personId: userInfo?.id }),
    {
      onSuccess: (data, activityId) => {
        hideDrawer();
        //TODO add generic jnaming for activites / activity
        queryClient.invalidateQueries(['activity', activityId]);
        queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

        //invalidate queries
        //TODO display success notification?
      },
      onError: () => {
        toast.error('Failed to leave activity');
      }
    }
  );

  React.useEffect(() => {
    const handlePopstate = () => {
      // Your logic to handle browser back navigation
      console.log('Browser back navigation detected!');
    };

    // Add the event listener when the component mounts
    window.addEventListener('popstate', handlePopstate);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  const handleActionClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto, activityId?: number) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(`${ApplicationLocations.ACTIVITY_MEMBERS}/${activityId}`);
        case ActivityActionsTypeEnumDto.LEAVE:
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={activityId}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendLeaveActivity}
              />
            )
          });
        case ActivityActionsTypeEnumDto.MORE_INFORMATION:
          return navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`);
        case ActivityActionsTypeEnumDto.MAP:
          return navigate(`${ApplicationLocations.MAP}/${activityId}`);
        case ActivityActionsTypeEnumDto.JOIN:
          return sendJoinActivity(activityId);
        case ActivityActionsTypeEnumDto.EDIT:
          return navigate(`${ApplicationLocations.EDIT_ACTIVITY}/${activityId}`);
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
            )
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
        content: <ActivityActions onActionClick={handleActionClick} activity={activity} />
      });
    },
    [toggleDrawer]
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
      )
      // onClose: () => setIsFirstTimeLogin?.(false),
    });
  }, [location]);

  React.useEffect(() => {
    Boolean(isFirstTimeLogin) &&
      toggleDrawer({
        open: true,
        content: <FirstTimeLoginContent />,
        onClose: () => setIsFirstTimeLogin?.(false)
      });
  }, [isFirstTimeLogin, toggleDrawer]);

  return (
    <AnimationDiv>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 1,
          pl: 1,
          pr: 1
        }}>
        <Typography variant="h4">Explore</Typography>
        <OffliButton
          variant="text"
          sx={{
            width: 180,
            justifyContent: 'flex-end'
          }}
          startIcon={<PlaceIcon sx={{ fontSize: '1.4rem', mr: -0.5, color: 'primary.main' }} />}
          onClick={handleLocationSelect}
          data-test-id="current-location-btn">
          <Typography
            sx={{
              fontSize: 16,
              color: 'primary.main',
              // width: "100%",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 'bold'
            }}>
            {location?.name ?? 'No location found'}
          </Typography>
        </OffliButton>
      </Box>
      <Searchbar />
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 1,
            pl: 1
          }}>
          <Typography variant="h4">Near you</Typography>
          <OffliButton
            variant="text"
            sx={{ fontSize: 16 }}
            startIcon={<MapIcon sx={{ fontSize: '1.2rem', ml: -0.7, color: 'primary.main' }} />}
            onClick={() => navigate(ApplicationLocations.MAP)}
            data-testid="see-map-btn">
            Show map
          </OffliButton>
        </Box>
        {[...(pages?.[0] ?? [])].length > 0 ? (
          <Box
            sx={{
              px: 1
            }}>
            <InfiniteScroll
              pageStart={0}
              loadMore={() =>
                !isFetchingNextPage && [...(pages?.[0] ?? [])].length > 8 && fetchNextPage()
              }
              hasMore={hasNextPage}
              loader={<Loader key={'loader'} />}
              useWindow={false}>
              <>
                {pages?.map((group, i) => (
                  <React.Fragment key={i}>
                    {group?.map((activity) => (
                      <ActivityCard
                        key={activity?.id}
                        activity={activity}
                        onPress={() =>
                          navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`)
                        }
                        onLongPress={openActivityActions}
                        sx={{ mx: 0, mb: 3, width: '100%' }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </>
            </InfiniteScroll>
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 4 }} variant="subtitle2">
            No new activities near you
          </Typography>
        )}
      </>
    </AnimationDiv>
  );
};

export default ExploreScreen;
