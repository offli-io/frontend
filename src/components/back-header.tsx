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
  headerRightContent?: React.ReactElement;
}

const BackHeader: React.FC<IBackHeaderProps> = ({
  title,
  sx,
  to,
  headerRightContent,
}) => {
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
  }, [fromLocation, location, navigate]);

  return (
    <Box sx={{ boxShadow: "1px 2px 2px #ccc", mb: 0.5, ...sx }}>
      <Box
        sx={{
          width: "100%",
          // borderBottom: '1px solid lightgrey',
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          pt: 1,
          boxSizing: "border-box",
        }}
      >
        {fromLocation && (
          <IconButton
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
            <ArrowBackIosNewIcon />
          </IconButton>
        )}
        <Box
          sx={{
            // flex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
            // mr: 6,
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: ({ palette }) => palette?.text.primary }}
          >
            {title}
          </Typography>
        </Box>
        {headerRightContent}
      </Box>
    </Box>
  );
};

export default BackHeader;
