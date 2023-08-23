import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { NavigateFunction } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { DrawerContext } from "../../../assets/theme/drawer-provider";
import BuddyItem from "../../../components/buddy-item";
import { useBuddies } from "../../../hooks/use-buddies";
import { useUsers } from "../../../hooks/use-users";
import {
  IPerson,
  IPersonExtended,
} from "../../../types/activities/activity.dto";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import { useSendBuddyRequest } from "../../profile-screen/hooks/use-send-buddy-request";
import { isBuddy } from "../../my-buddies-screen/utils/is-buddy.util";

interface IAddBuddiesContentProps {
  navigate?: NavigateFunction;
}

const SearchBuddiesContent: React.FC<IAddBuddiesContentProps> = ({
  navigate,
}) => {
  const [username, setUsername] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { shadows } = useTheme();
  const [usernameDebounced] = useDebounce(username, 150);
  const { toggleDrawer } = React.useContext(DrawerContext);

  //TODO polish this avoid erorrs that cause whole application down
  const { data: { data = [] } = {}, isLoading } = useUsers({
    username: usernameDebounced,
  });

  const queryClient = useQueryClient();

  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["buddy-state"]);
        queryClient.invalidateQueries(["buddies"]);
      },
    }
  );

  const { data: { data: buddies = [] } = {}, isLoading: areBuddiesLoading } =
    useBuddies();

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
    (e: React.MouseEvent<HTMLButtonElement>, user?: IPerson) => {
      e.stopPropagation();
      handleSendBuddyRequest(user?.id);
    },
    [handleSendBuddyRequest]
  );

  return (
    <Box
      sx={{ mx: 1.5, height: 450, position: "relative", overflow: "hidden" }}
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

      <Box sx={{ overflowY: "auto", height: "100%" }}>
        {(data ?? [])?.length < 1 && !isLoading ? (
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
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              data
                ?.filter((user) => user?.id !== userInfo?.id)
                ?.map((user: IPersonExtended) => (
                  <BuddyItem
                    key={user?.id}
                    buddy={user}
                    onClick={(_user) => handleBuddyActionsClick(_user)}
                    actionContent={
                      isBuddy(buddies, user?.id) ? null : (
                        <IconButton onClick={(e) => handleAddBuddy(e, user)}>
                          <PersonAddIcon color="primary" />
                        </IconButton>
                      )
                    }
                  />
                ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchBuddiesContent;
