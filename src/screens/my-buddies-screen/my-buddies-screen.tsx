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

const MyBuddiesScreen = () => {
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const { toggleDrawer } = React.useContext(DrawerContext);

  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { data, isLoading } = useBuddies({ text: currentSearch });

  const handleActionClick = React.useCallback(
    (type?: ActivityMembersActionTypeDto, userId?: string) => {
      // switch (type) {
      //   case ActivityMembersActionTypeDto.KICK:
      //     return sendKickPersonFromActivity(userId);
      //   case ActivityMembersActionTypeDto.PROMOTE:
      //     return console.log("call promote with id");
      //   default:
      //     return;
      // }
      console.log(type);
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
            onBuddyClick={(type, id) => console.log(type, id)}
          />
        ),
      });
    },
    [toggleDrawer]
  );

  return (
    <>
      <BackHeader title="Buddies" to={from} />
      <Box sx={{ mx: 1.5 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            onClick={() => navigate(ApplicationLocations.ACTIVITIES)}
          >
            <PersonAddIcon color="primary" />
          </IconButton>
        </Box>
        {(data?.data ?? [])?.length < 1 ? (
          <Box
            sx={{
              height: 100,
              width: "100%",
              my: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
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
              my: 3,
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
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
                    <IconButton onClick={() => handleBuddyActionsClick(buddy)}>
                      <MoreHorizIcon />
                    </IconButton>
                  }
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default MyBuddiesScreen;
