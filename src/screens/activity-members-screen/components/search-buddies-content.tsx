import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  getActivityParticipants,
  inviteBuddyToActivity,
} from "../../../api/activities/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { DrawerContext } from "../../../assets/theme/drawer-provider";
import BuddyItem from "../../../components/buddy-item";
import { useBuddies } from "../../../hooks/use-buddies";
import {
  IPerson,
  IPersonExtended,
} from "../../../types/activities/activity.dto";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import { isAlreadyParticipant } from "../../../utils/person.util";
import { isBuddy } from "../../my-buddies-screen/utils/is-buddy.util";
import { useSendBuddyRequest } from "../../profile-screen/hooks/use-send-buddy-request";
import OffliButton from "../../../components/offli-button";
import { ActivityInviteStateEnum } from "../../../types/activities/activity-invite-state-enum.dto";

interface IAddBuddiesContentProps {
  activityId?: number;
}

const SearchBuddiesContent: React.FC<IAddBuddiesContentProps> = ({
  activityId,
}) => {
  const [username, setUsername] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { shadows } = useTheme();
  const navigate = useNavigate();

  const [usernameDebounced] = useDebounce(username, 150);
  const { toggleDrawer } = React.useContext(DrawerContext);

  const queryClient = useQueryClient();

  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(["activity-participants", activityId], () =>
    getActivityParticipants({ activityId: Number(activityId) })
  );

  const { data: { data: buddies = [] } = {}, isLoading: areBuddiesLoading } =
    useBuddies({
      text: usernameDebounced,
      // select: (data) => ({
      //   ...data,
      //   data: data?.data?.filter(
      //     (buddy) => !isAlreadyParticipant(participants, buddy)
      //   ),
      // }),
    });

  const { mutate: sendInviteBuddy, isLoading: isInviting } = useMutation(
    ["invite-participant"],
    (buddy?: IPerson) =>
      inviteBuddyToActivity(Number(activityId), Number(buddy?.id), {
        status: ActivityInviteStateEnum.INVITED,
        invited_by_id: Number(userInfo?.id),
      }),
    {
      onSuccess: (data, buddy) => {
        queryClient.invalidateQueries(["activity-participants"]);
        // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to invite user", { variant: "error" });
      },
    }
  );

  const invitableBuddies = React.useMemo(
    () =>
      buddies?.filter?.((buddy) => !isAlreadyParticipant(participants, buddy)),
    [buddies, participants]
  );

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

  const handleBuddyInviteClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, user: IPerson) => {
      e.stopPropagation();
      sendInviteBuddy(user);
    },
    [sendInviteBuddy]
  );

  const isLoading =
    areBuddiesLoading || areActivityParticipantsLoading || isInviting;

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
        {invitableBuddies?.length < 1 && !isLoading ? (
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
              invitableBuddies?.map((user: IPersonExtended) => (
                <BuddyItem
                  key={user?.id}
                  buddy={user}
                  actionContent={
                    <OffliButton
                      sx={{ fontSize: 16 }}
                      size="small"
                      onClick={(e) => handleBuddyInviteClick(e, user)}
                    >
                      Invite
                    </OffliButton>
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
