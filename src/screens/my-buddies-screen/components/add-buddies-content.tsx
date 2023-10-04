import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getUsersPromiseResolved } from "api/activities/requests";
import { toggleBuddyInvitation } from "api/users/requests";
import Loader from "components/loader";
import { useSnackbar } from "notistack";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useInView } from "react-intersection-observer";
import { NavigateFunction } from "react-router-dom";
import { BuddyRequestActionEnum } from "types/users";
import { useDebounce } from "use-debounce";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { DrawerContext } from "../../../assets/theme/drawer-provider";
import BuddyItem from "../../../components/buddy-item";
import { useBuddies } from "../../../hooks/use-buddies";
import { PAGED_USERS_QUERY_KEY, useUsers } from "../../../hooks/use-users";
import {
  IPerson,
  IPersonExtended,
} from "../../../types/activities/activity.dto";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import { useSendBuddyRequest } from "../../profile-screen/hooks/use-send-buddy-request";
import { isBuddy } from "../utils/is-buddy.util";
import AddBuddiesActionContent from "./add-buddies-action-content";

interface IAddBuddiesContentProps {
  navigate?: NavigateFunction;
}

const AddBuddiesContent: React.FC<IAddBuddiesContentProps> = ({ navigate }) => {
  const [username, setUsername] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { shadows } = useTheme();
  const [usernameDebounced] = useDebounce(username, 150);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const usersContentDivRef = React.useRef<HTMLDivElement | null>(null);
  const bottom = React.useRef<any>(null);

  const { toggleDrawer } = React.useContext(DrawerContext);

  //TODO polish this avoid erorrs that cause whole application down
  const { buddieStates } = useUsers({
    params: {
      username: usernameDebounced,
      buddyIdToCheckInBuddies: userInfo?.id,
    },
  });

  const {
    data: paginatedUsersData,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [PAGED_USERS_QUERY_KEY, usernameDebounced],
    ({ pageParam = 0 }) =>
      getUsersPromiseResolved({
        offset: pageParam,
        username: usernameDebounced,
        buddyIdToCheckInBuddies: userInfo?.id,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages?.length;
        // only return next page when this page has full array (20 items)
        return lastPage?.length >= 20 ? nextPage : undefined;
      },
    }
  );

  const { ref, inView, entry } = useInView();

  const queryClient = useQueryClient();

  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["buddy-state"]);
        queryClient.invalidateQueries(["buddies"]);
        queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const { mutate: sendAcceptBuddyRequest, isLoading: isTogglingBuddyRequest } =
    useMutation(
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
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries(["buddies"]);
          queryClient.invalidateQueries(["buddy-state"]);
          queryClient.invalidateQueries(["users"]);
          queryClient.invalidateQueries(["user"]);

          enqueueSnackbar(
            "You have successfully confirmed user as your buddy",
            {
              variant: "success",
            }
          );
        },
        onError: (error, variables) => {
          enqueueSnackbar("Failed to add user as your buddy", {
            variant: "error",
          });
        },
      }
    );

  const { buddies, isLoading: areBuddiesLoading } = useBuddies();

  const handleBuddyActionsClick = React.useCallback(
    (buddy?: IPerson) => {
      toggleDrawer({ open: false });
      navigate?.(
        `${ApplicationLocations.PROFILE}/${
          isBuddy(buddies, buddy?.id) ? "buddy" : "user"
        }/${buddy?.id}`,
        {
          state: {
            from: ApplicationLocations.BUDDIES,
          },
        }
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

  console.log(hasNextPage);

  return (
    <Box
      sx={{ mx: 1.5, maxHeight: 500, position: "relative", overflow: "hidden" }}
    >
      <TextField
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          "& .MuiOutlinedInput-root": {
            pr: 0,
            boxShadow: shadows[1],
          },
          "& input::placeholder": {
            fontSize: 14,
          },
          // TODO searchbar is scrolling with its content
          position: "sticky",
          top: 0,
          bgcolor: "white",
          maxHeight: 50,
          zIndex: 555,
          my: 1,
        }}
        value={username}
        placeholder="Search among users"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: "1.2rem" }} />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setUsername(e.target.value)}
      />
      {isFetching || isFetchingNextPage ? (
        <Box sx={{ width: "100%", mb: 1.5 }}>
          <LinearProgress />
        </Box>
      ) : null}

      <Box ref={usersContentDivRef} sx={{ overflowY: "auto" }} id="scrolik">
        {[...(paginatedUsersData?.pages ?? [])]?.length < 1 &&
        !isFetchingNextPage ? (
          <Box
            sx={{
              height: 100,
              width: "100%",
              mt: 7,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              No users found
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              width: "100%",
            }}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={() => fetchNextPage()}
              hasMore={Boolean(hasNextPage)}
              loader={<Loader />}
              height={300}
              useWindow={false}
              getScrollParent={() => document.getElementById("scrolik")}
            >
              {paginatedUsersData?.pages?.map((group, index) => (
                <React.Fragment key={index}>
                  {group
                    ?.filter(
                      (user) =>
                        user?.id !== userInfo?.id && !isBuddy(buddies, user?.id)
                    )
                    ?.map((user: IPersonExtended, index) => (
                      <BuddyItem
                        key={user?.id}
                        buddy={user}
                        divRef={
                          index === paginatedUsersData?.pages?.length * 20 - 5
                            ? ref
                            : undefined
                        }
                        onClick={(_user) => handleBuddyActionsClick(_user)}
                        actionContent={
                          <AddBuddiesActionContent
                            buddieStates={buddieStates}
                            userId={user?.id}
                            onAddBuddyClick={handleAddBuddy}
                            onAcceptBuddyRequestClick={handleAcceptBuddyRequest}
                            isLoading={
                              isSendingBuddyRequest || isTogglingBuddyRequest
                            }
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
