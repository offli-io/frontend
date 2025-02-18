import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, LinearProgress, Typography } from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersPromiseResolved } from 'api/activities/requests';
import { toggleBuddyInvitation } from 'api/users/requests';
import Loader from 'components/loader';
import { USER_QUERY_KEY } from 'hooks/users/use-user';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { BuddyRequestActionEnum } from 'types/users';
import { useDebounce } from 'use-debounce';
import { USERS_LIMIT } from 'utils/common-constants';
import BuddyItem from '../../../components/buddy-item';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import { DrawerContext } from '../../../components/context/providers/drawer-provider';
import OffliTextField from '../../../components/offli-text-field';
import { useBuddies } from '../../../hooks/users/use-buddies';
import { PAGED_USERS_QUERY_KEY, useUsers } from '../../../hooks/users/use-users';
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
  const [usernameDebounced] = useDebounce(username, 150);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const usersContentDivRef = React.useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { toggleDrawer } = React.useContext(DrawerContext);
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

      return toggleBuddyInvitation(userInfo?.id, buddyToBeId, BuddyRequestActionEnum.CONFIRM);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['buddies']);
        queryClient.invalidateQueries(['buddy-state']);
        queryClient.invalidateQueries(['users']);
        queryClient.invalidateQueries([USER_QUERY_KEY]);
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

  const [isFocused, setIsFocused] = useState(false);

  const clearPlaceholder = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Box sx={{ mx: 1.5, maxHeight: 500, position: 'relative', overflow: 'hidden' }}>
      <OffliTextField
        sx={{
          width: '95%',
          display: 'flex',
          justifyContent: 'center',
          my: 2,
          '& .MuiOutlinedInput-root': {
            pr: 0
          },
          '& input::placeholder': {
            fontSize: 14,
            color: 'primary.main',
            fontWeight: 400,
            opacity: 1,
            pl: 1
          },
          '& fieldset': { border: 'none' },
          backgroundColor: ({ palette }) => palette?.primary?.light,
          borderRadius: '10px'
        }}
        value={username}
        placeholder={isFocused ? '' : 'Search among users'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            </InputAdornment>
          )
        }}
        onChange={(e) => setUsername(e.target.value)}
        onClick={clearPlaceholder}
        onBlur={handleBlur}
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
