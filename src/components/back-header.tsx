import React, { useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  AppBar,
  Typography,
  SxProps,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { ApplicationLocations } from "../types/common/applications-locations.dto";
import offliLogo from "../assets/img/logoPurple.png";
import { HEADER_HEIGHT } from "../utils/common-constants";

interface IBackHeaderProps {
  title?: string;
  sx?: SxProps;
  to?: string;
}

const BackHeader: React.FC<IBackHeaderProps> = ({ title, sx, to }) => {
  const location = useLocation().pathname;
  const [notificationNumber] = useState(5);
  const navigate = useNavigate();

  const toParsed = to?.split("/");
  const fromLocation = toParsed && `/${toParsed[toParsed?.length - 1]}`;

  const handleBackNavigation = React.useCallback(() => {
    if (!fromLocation) {
      return;
    }
    // edge cases when there is double navigation via header (e.g. BUDDIES -> ADD_BUDDY screens)
    if (
      fromLocation === ApplicationLocations.BUDDIES &&
      location === ApplicationLocations.ADD_BUDDIES
    ) {
      return navigate(fromLocation, {
        state: {
          from: ApplicationLocations.PROFILE,
        },
      });
    }
    navigate(fromLocation);
  }, []);

  return (
    <Box sx={{ boxShadow: "1px 2px 2px #ccc", mb: 0.5, ...sx }}>
      <Box
        sx={{
          width: "100%",
          // borderBottom: '1px solid lightgrey',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          pt: 1,
          boxSizing: "border-box",
        }}
      >
        {fromLocation && (
          <IconButton
            // component={Link}
            // to={fromLocation}
            onClick={handleBackNavigation}
            color="primary"
            sx={
              {
                // flex: 1,
                // position: 'absolute',
                // top: 10,
                // left: 5,
                // textTransform: 'none',
              }
            }
          >
            <ArrowBackIosNewIcon

            // sx={{ color: 'primary.main' }}
            />
          </IconButton>
        )}
        <Box
          sx={{
            flex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mr: 6,
          }}
        >
          <Typography variant="h4">{title}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BackHeader;
