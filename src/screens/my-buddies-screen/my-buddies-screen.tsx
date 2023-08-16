import React from "react";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { useLocation, useNavigate } from "react-router-dom";
import BackHeader from "../../components/back-header";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import BuddyItem from "../../components/buddy-item";
import { useBuddies } from "../../hooks/use-buddies";
import { ActivityMembersActionTypeDto } from "../../types/common/activity-members-action-type.dto";
import BuddyActions from "./components/buddy-actions";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import { IPerson } from "../../types/activities/activity.dto";
import { BuddyActionTypeEnum } from "../../types/common/buddy-actions-type-enum.dto";
import { addBuddy, deleteBuddy } from "../../api/users/requests";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import NoBuddiesScreen from "./components/no-buddies-screen";
import BuddySuggestCard from "../../components/buddy-suggest-card";
import {
  getBuddies,
  getRecommendedBuddies,
} from "../../api/activities/requests";
import { useSendBuddyRequest } from "../profile-screen/hooks/use-send-buddy-request";
import AddBuddiesContent from "./components/add-buddies-content";

const MyBuddiesScreen = () => {
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const queryClient = useQueryClient();
  const from =
    (location?.state as ICustomizedLocationStateDto)?.from ??
    ApplicationLocations.PROFILE;
  const { data, isLoading, invalidateBuddies } = useBuddies({
    text: currentSearch,
  });

  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["recommended-buddies"]);
      },
    }
  );

  const {
    data: recommendedBuddiesData,
    isLoading: areBuddiesRecommendationsLoading,
  } = useQuery(
    ["recommended-buddies", userInfo?.id],
    () => getRecommendedBuddies(userInfo?.id ?? -1),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load recommended buddies`, {
          variant: "error",
        });
      },
      enabled: !!userInfo?.id,
    }
  );

  const { mutate: sendDeleteBuddy } = useMutation(
    ["delete-buddy"],
    (id?: number) => deleteBuddy(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        toggleDrawer({ open: false, content: undefined });
        //TODO invalidate only my data
        queryClient.invalidateQueries(["user"]);
        invalidateBuddies();
        enqueueSnackbar("Buddy was successfully deleted", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Failed to delete buddy", {
          variant: "error",
        });
      },
    }
  );

  const navigateToBuddyProfile = React.useCallback(
    (userId?: number) =>
      navigate(`${ApplicationLocations.PROFILE}/buddy/${userId}`, {
        state: {
          from: ApplicationLocations.BUDDIES,
        },
      }),
    [navigate]
  );

  const handleBuddyActionClick = React.useCallback(
    (type?: BuddyActionTypeEnum, userId?: number) => {
      switch (type) {
        case BuddyActionTypeEnum.PROFILE:
          toggleDrawer({ open: false, content: undefined });
          return navigateToBuddyProfile(userId);
        case BuddyActionTypeEnum.REMOVE:
          return sendDeleteBuddy(userId);
        default:
          return;
      }
    },
    []
  );

  const handleBuddyActionsClick = React.useCallback(
    (buddy?: IPerson) => {
      toggleDrawer({
        open: true,
        content: (
          <BuddyActions
            buddy={buddy}
            onBuddyActionClick={handleBuddyActionClick}
          />
        ),
      });
    },
    [toggleDrawer]
  );

  const handleAddBuddies = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: <AddBuddiesContent navigate={navigate} />,
    });
  }, [toggleDrawer]);

  return (
    <>
      <Box sx={{ mx: 1.5, height: "100%" }}>
        {(!data || (data?.data?.length === 0 && currentSearch?.length === 0)) &&
        !isLoading ? (
          <NoBuddiesScreen onAddBuddiesClick={handleAddBuddies} />
        ) : (
          <Box
            sx={{
              overflow: "hidden",
              position: "relative",
              height: "100%",
              zIndex: 555,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "sticky",
                top: 0,
                zIndex: 555,
              }}
            >
              <TextField
                autoFocus
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  my: 1.5,
                  "& .MuiOutlinedInput-root": {
                    pr: 0,
                  },
                  "& input::placeholder": {
                    fontSize: 14,
                  },
                }}
                value={currentSearch}
                placeholder="Search among your buddies"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setCurrentSearch(e.target.value)}
              />

              <IconButton
                sx={{ fontSize: 14, ml: 1 }}
                onClick={handleAddBuddies}
              >
                <PersonAddIcon color="primary" />
              </IconButton>
            </Box>
            {(recommendedBuddiesData?.data ?? [])?.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  People you attended activity with
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    overflowX: "scroll",
                    width: "100%",
                    "::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {recommendedBuddiesData?.data?.map((buddy) => (
                    <>
                      <BuddySuggestCard
                        key={buddy?.id}
                        buddy={buddy}
                        onAddBuddyClick={(buddy) =>
                          handleSendBuddyRequest(buddy?.id)
                        }
                        isLoading={isSendingBuddyRequest}
                      />
                    </>
                  ))}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                height: "100%",
                overflow: "auto",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                Your buddies
              </Typography>
              {(data?.data ?? [])?.length < 1 ? (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    // my: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // borderTop: "1px solid lightgrey",
                    // borderBottom: "1px solid lightgrey",
                  }}
                >
                  <Typography
                    sx={{ color: (theme) => theme.palette.inactive.main }}
                  >
                    No buddies found
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    overflowY: "auto",
                    "::-webkit-scrollbar": { display: "none" },
                    mb: 10,
                  }}
                >
                  {isLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  ) : (
                    data?.data.map((buddy) => (
                      <BuddyItem
                        key={buddy?.id}
                        buddy={buddy}
                        actionContent={
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuddyActionsClick(buddy);
                            }}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        }
                        onClick={(buddy) => navigateToBuddyProfile(buddy?.id)}
                      />
                    ))
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MyBuddiesScreen;
