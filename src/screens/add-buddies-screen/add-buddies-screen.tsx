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
// import BuddyActions from "./components/buddy-actions";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import { IPerson } from "../../types/activities/activity.dto";
import { BuddyActionTypeEnum } from "../../types/common/buddy-actions-type-enum.dto";
import { addBuddy, deleteBuddy } from "../../api/users/requests";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
// import BuddySuggestCard from "../../components/buddy-suggest-card";

const AddBuddiesScreen = () => {
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { data, isLoading, invalidateBuddies } = useBuddies({
    text: currentSearch,
  });

  const { mutate: sendDeleteBuddy } = useMutation(
    ["delete-buddy"],
    (id?: string) => deleteBuddy(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        toggleDrawer({ open: false, content: undefined });
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

  const { mutate: sendAddBuddy, isLoading: isAddBuddyLoading } = useMutation(
    ["add-buddy"],
    (id?: string) => addBuddy(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        // toggleDrawer({ open: false, content: undefined });
        invalidateBuddies();

        enqueueSnackbar("Buddy request was sent", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Failed to add new buddy", {
          variant: "error",
        });
      },
    }
  );

  const handleBuddyActionClick = React.useCallback(
    (type?: BuddyActionTypeEnum, userId?: string) => {
      switch (type) {
        case BuddyActionTypeEnum.PROFILE:
          toggleDrawer({ open: false, content: undefined });
          return navigate(`${ApplicationLocations.PROFILE}/buddy/${userId}`, {
            state: {
              from: ApplicationLocations.BUDDIES,
            },
          });
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
          //   <BuddyActions
          //     buddy={buddy}
          //     onBuddyActionClick={handleBuddyActionClick}
          //   />
          <></>
        ),
      });
    },
    [toggleDrawer]
  );

  return (
    <>
      <BackHeader title="Find new buddies" to={from} />
      <Box sx={{ mx: 1.5, height: "100%" }}>
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

        <Box>
          {(data?.data ?? [])?.length < 1 ? (
            <Box
              sx={{
                height: 100,
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
                No activity members
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                height: 300,
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                // my: 3,
                // borderTop: "1px solid lightgrey",
                // borderBottom: "1px solid lightgrey",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                data?.data.map((buddy) => (
                  <BuddyItem
                    key={buddy?.id}
                    buddy={buddy}
                    actionContent={
                      <IconButton
                        onClick={() => handleBuddyActionsClick(buddy)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    }
                  />
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AddBuddiesScreen;
