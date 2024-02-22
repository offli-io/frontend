import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersPromiseResolved } from 'api/activities/requests';
import { toggleBuddyInvitation } from 'api/users/requests';
import Loader from 'components/loader';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { BuddyRequestActionEnum } from 'types/users';
import { useDebounce } from 'use-debounce';
import { USERS_LIMIT } from 'utils/common-constants';
import BuddyItem from '../../../components/buddy-item';
import { AuthenticationContext } from '../../../context/providers/authentication-provider';
import { DrawerContext } from '../../../context/providers/drawer-provider';
import { useBuddies } from '../../../hooks/use-buddies';
import { PAGED_USERS_QUERY_KEY, useUsers } from '../../../hooks/use-users';
import { IPerson } from '../../../types/activities/activity.dto';
import { ApplicationLocations } from '../../../types/common/applications-locations.dto';
import { useSendBuddyRequest } from '../../profile-screen/hooks/use-send-buddy-request';
import { isBuddy } from '../utils/is-buddy.util';
import AddBuddiesActionContent from './add-buddies-action-content';

interface IAddBuddiesContentProps {
  navigate?: NavigateFunction;
}

const AddBuddiesContent: React.FC<IAddBuddiesContentProps> = ({ navigate }) => {
  const [username, setUsername] = React.useState('');
  const { userInfo } = React.useContext(AuthenticationContext);
  const { shadows } = useTheme();
  const [usernameDebounced] = useDebounce(username, 150);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const usersContentDivRef = React.useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { toggleDrawer } = React.useContext(DrawerContext);

  //TODO polish this avoid erorrs that cause whole application down
  const { buddieStates } = useUsers({
    params: {
      username: usernameDebounced,
      buddyIdToCheckInBuddies: userInfo?.id
    }
  });

  const {
    data: paginatedUsersData,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery(
    [PAGED_USERS_QUERY_KEY, usernameDebounced],
    ({ pageParam = 0 }) =>
      //TODO maybe add buddy states also from this hook - but can't be paged
      getUsersPromiseResolved({
        limit: USERS_LIMIT,
        offset: pageParam,
        username: usernameDebounced,
        buddyIdToCheckInBuddies: userInfo?.id
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages?.length;
        // only return next page when this page has full array (20 items)
        return lastPage?.users?.length >= USERS_LIMIT ? nextPage * USERS_LIMIT : undefined;
      },
      enabled: !!usernameDebounced
    }
  );

  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest({
    onSuccess: () => {
      queryClient.invalidateQueries(['buddy-state']);
      queryClient.invalidateQueries(['buddies']);
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['recommended-buddies']);
      queryClient.invalidateQueries([PAGED_USERS_QUERY_KEY]);
    }
  });

  const { mutate: sendAcceptBuddyRequest, isLoading: isTogglingBuddyRequest } = useMutation(
    (buddyToBeId?: number) => {
      abortControllerRef.current = new AbortController();

      return toggleBuddyInvitation(
        userInfo?.id,
        buddyToBeId,
        BuddyRequestActionEnum.CONFIRM
        //   abortControllerRef.current.signal
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['buddies']);
        queryClient.invalidateQueries(['buddy-state']);
        queryClient.invalidateQueries(['users']);
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['recommended-buddies']);
        toast.success('You have successfully confirmed user as your buddy');
      },
      onError: () => {
        toast.error('Failed to add user as your buddy');
      }
    }
  );

  const { buddies } = useBuddies();

  const handleBuddyActionsClick = React.useCallback(
    (buddy?: IPerson) => {
      toggleDrawer({ open: false });
      navigate?.(
        `${ApplicationLocations.PROFILE}/${
          isBuddy(buddies, buddy?.id) ? 'buddy' : 'user'
        }/${buddy?.id}`
      );
    },
    [toggleDrawer]
  );

  const handleAddBuddy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, userId?: number) => {
      e.stopPropagation();
      handleSendBuddyRequest(userId);
    },
    [handleSendBuddyRequest]
  );

  const handleAcceptBuddyRequest = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, userId?: number) => {
      e.stopPropagation();
      sendAcceptBuddyRequest(userId);
    },
    [handleSendBuddyRequest]
  );

  return (
    <Box sx={{ mx: 1.5, maxHeight: 500, position: 'relative', overflow: 'hidden' }}>
      <TextField
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& .MuiOutlinedInput-root': {
            pr: 0,
            boxShadow: shadows[1]
          },
          '& input::placeholder': {
            fontSize: 14
          },
          // TODO searchbar is scrolling with its content
          position: 'sticky',
          top: 0,
          // bgcolor: 'white',
          maxHeight: 50,
          zIndex: 555,
          my: 1
        }}
        value={username}
        placeholder="Search among users"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: '1.2rem' }} />
            </InputAdornment>
          )
        }}
        onChange={(e) => setUsername(e.target.value)}
      />
      {isFetching || isFetchingNextPage ? (
        <Box sx={{ width: '100%', mb: 1.5 }}>
          <LinearProgress />
        </Box>
      ) : null}

      <Box ref={usersContentDivRef} sx={{ overflowY: 'auto' }} id="scrolik">
        {[...(paginatedUsersData?.pages?.[0]?.users ?? [])]?.length < 1 && !isFetchingNextPage ? (
          <Box
            sx={{
              height: 100,
              width: '100%',
              my: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              {usernameDebounced ? 'No users found' : 'Start typing username to see results'}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              width: '100%'
            }}>
            <InfiniteScroll
              pageStart={0}
              loadMore={() => !isFetchingNextPage && fetchNextPage()}
              hasMore={Boolean(hasNextPage)}
              loader={<Loader />}
              height={300}
              useWindow={false}
              getScrollParent={() => document.getElementById('scrolik')}>
              {paginatedUsersData?.pages?.map((group, index) => (
                <React.Fragment key={index}>
                  {group?.users
                    ?.filter((user) => user?.id !== userInfo?.id && !isBuddy(buddies, user?.id))
                    ?.map((user: IPerson) => (
                      <BuddyItem
                        key={user?.id}
                        buddy={user}
                        onClick={(_user) => handleBuddyActionsClick(_user)}
                        actionContent={
                          <AddBuddiesActionContent
                            buddieStates={buddieStates}
                            userId={user?.id}
                            onAddBuddyClick={handleAddBuddy}
                            onAcceptBuddyRequestClick={handleAcceptBuddyRequest}
                            isLoading={isSendingBuddyRequest || isTogglingBuddyRequest}
                          />
                        }
                      />
                    ))}
                </React.Fragment>
              ))}
            </InfiniteScroll>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddBuddiesContent;
