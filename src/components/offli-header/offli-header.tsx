import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, IconButton, SxProps, useTheme } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import offliLogo from "../../assets/img/logoPurple.png";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { useNotifications } from "../../hooks/use-notifications";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { HEADER_HEIGHT } from "../../utils/common-constants";
import BackHeader from "./components/back-header";
import { mapPathnameToHeaderTitle } from "./utils/header-utils";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { NOT_EXACT_UNALLOWED_URLS } from "../../app/layout";

interface IProps {
  sx?: SxProps;
}

const OffliHeader: React.FC<IProps> = ({ sx }) => {
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const navigate = useNavigate();
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);
  const { palette } = useTheme();

  const { data: notificationsData } = useNotifications(userInfo?.id);

  //TODO add component non-depending logic like styles outside the components
  const iconStyle = { height: "24px", mr: -1 };
  const badgeStyle = {
    "& .MuiBadge-badge": {
      transform: "scale(0.8)",
      right: -14,
      top: -10,
    },
  };

  const displayBackHeader = React.useMemo(
    () =>
      [
        ApplicationLocations.SETTINGS,
        ApplicationLocations.EDIT_PROFILE,
        ApplicationLocations.EDIT_ACTIVITY,
        ApplicationLocations.CHOOSE_LOCATION,
        ApplicationLocations.MAP,
        ApplicationLocations.BUDDIES,
        ApplicationLocations.ADD_BUDDIES,
        ApplicationLocations.CHOOSE_USERNAME_GOOGLE,
        ApplicationLocations.SEARCH,
      ].includes(location?.pathname as ApplicationLocations) ||
      NOT_EXACT_UNALLOWED_URLS?.some((item) =>
        location?.pathname.includes(item)
      ),
    [location]
  );

  return (
    <Box
      ref={headerRef}
      sx={{
        height: HEADER_HEIGHT,
        boxShadow: "1px 2px 2px #ccc",
        position: "sticky",
        top: 0,
        boxSizing: "border-box",
        // pt: 2,
        zIndex: 500,
        bgcolor: palette.background.default,
        display: "flex",
        ...sx,
      }}
    >
      {displayBackHeader ? (
        <BackHeader
          title={mapPathnameToHeaderTitle(
            location?.pathname as ApplicationLocations
          )}
          to={from}
        />
      ) : (
        <Box
          sx={{
            width: "90%",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={offliLogo}
            alt="Offli logo"
            style={{ height: "40px" }}
            data-testid="offli-logo"
          />
          <Box
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              onClick={() => {
                navigate(ApplicationLocations.NOTIFICATIONS, {
                  state: {
                    from: window.location.href,
                  },
                });
              }}
              data-testid="notifications-btn"
            >
              <Badge
                badgeContent={notificationsData?.data?.unseen}
                color="primary"
                sx={badgeStyle}
              >
                {location?.pathname === ApplicationLocations.NOTIFICATIONS ? (
                  <NotificationsIcon sx={iconStyle} />
                ) : (
                  <NotificationsNoneOutlinedIcon
                    sx={iconStyle}
                    // sx={{ color: 'primary.main' }}
                  />
                )}
              </Badge>
            </IconButton>
            <IconButton
              onClick={() => {
                navigate(ApplicationLocations.SETTINGS, {
                  state: {
                    from: window.location.href,
                  },
                });
              }}
              data-testid="settings-btn"
            >
              <SettingsIcon
                sx={{ iconStyle, ml: 0.5 }}
                // sx={{ color: 'primary.main' }}
              />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OffliHeader;
