import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteBuddy } from "../../api/users/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import BuddyItem from "../../components/buddy-item";
import { useBuddies } from "../../hooks/use-buddies";
import { IPerson } from "../../types/activities/activity.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { BuddyActionTypeEnum } from "../../types/common/buddy-actions-type-enum.dto";
import AddBuddiesContent from "./components/add-buddies-content";
import BuddyActions from "./components/buddy-actions";
import NoBuddiesScreen from "./components/no-buddies-screen";
import RecommendedBuddiesContent from "./components/recommended-buddies-content";

const MyBuddiesScreen = () => {
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { buddies, isLoading, invalidateBuddies } = useBuddies({
    text: currentSearch,
  });

  const { mutate: sendDeleteBuddy } = useMutation(
    ["delete-buddy"],
    (id?: number) => deleteBuddy(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        toggleDrawer({ open: false, content: undefined });
        //TODO invalidate only my data
        queryClient.invalidateQueries(["user"]);
        invalidateBuddies();
        toast.success("Buddy was successfully deleted");
      },
      onError: () => {
        toast.error("Failed to delete buddy");
      },
    }
  );

  const navigateToBuddyProfile = React.useCallback(
    (userId?: number) =>
      navigate(`${ApplicationLocations.USER_PROFILE}/${userId}`),
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

  const userHasNoBuddies =
    !buddies || (buddies?.length === 0 && currentSearch?.length === 0);

  return (
    <>
      <Box sx={{ mx: 1.5, height: userHasNoBuddies ? "100%" : "auto" }}>
        {userHasNoBuddies && !isLoading ? (
          <NoBuddiesScreen onAddBuddiesClick={handleAddBuddies} />
        ) : (
          <Box
            sx={{
              // overflow: "hidden",
              position: "relative",
              height: "100%",
              // overflow: "auto",
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
                zIndex: 20,
                bgcolor: ({ palette }) => palette?.background?.default,
              }}
            >
              <TextField
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
                <PersonAddIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </Box>
            <RecommendedBuddiesContent />
            <Box
              sx={{
                height: "100%",
              }}
            >
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                Your buddies
              </Typography>
              {(buddies ?? [])?.length < 1 && !isLoading ? (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                    width: "100%",
                    overflow: "hidden",
                    // height: '100%',
                    // overflowY: "auto",
                    // "::-webkit-scrollbar": { display: "none" },
                    mb: 2,
                  }}
                >
                  {isLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  ) : (
                    buddies?.map((buddy) => (
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
