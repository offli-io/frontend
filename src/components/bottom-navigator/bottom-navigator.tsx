import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Paper, SxProps, useTheme } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { CustomizationContext } from "../../assets/theme/customization-provider";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../../utils/common-constants";
import { mapLocationToNavigatorValue } from "./utils/map-location-to-navigator-value.util";

interface IBottomNavigatorProps {
  sx?: SxProps;
}

const BottomNavigator: React.FC<IBottomNavigatorProps> = ({ sx }) => {
  const { palette } = useTheme();
  const [value, setValue] = React.useState<ApplicationLocations>(
    ApplicationLocations.ACTIVITIES
  );
  const { userInfo } = React.useContext(AuthenticationContext);
  const { mode } = React.useContext(CustomizationContext);

  const location = useLocation();
  const paramsArray = location?.pathname.split("/");
  const id = paramsArray[paramsArray.length - 1]
    ? Number(paramsArray[paramsArray.length - 1])
    : -1;

  const isUserProfile = location?.pathname?.includes("/profile/user");

  return (
    <Paper
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: FOOTER_HEIGHT,
        bgcolor: palette?.background?.default,

        // boxShadow: 15,
      }}
      //TODO either Box with boxShadow as sx or Paper with elevation 3 - need to compare
      // sx={sx}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={mapLocationToNavigatorValue(value)}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          margin: "auto",
          "& .Mui-selected": {
            fontSize: "12px !important",
            // color: "primary.main",
          },
          color: palette?.background?.default,
          bgcolor: palette?.background?.default,
        }}
        data-testid="bottom-navigator"
      >
        <BottomNavigationAction
          label="Explore"
          icon={
            <TravelExploreIcon
              sx={{
                color:
                  value === ApplicationLocations.ACTIVITIES
                    ? "primary.main"
                    : undefined,
              }}
            />
          }
          component={Link}
          value={ApplicationLocations.ACTIVITIES}
          to={ApplicationLocations.ACTIVITIES}
          data-testid="navigator-activities"
          sx={{
            ...(mode === "dark" ? { color: palette?.text?.primary } : {}),
          }}
        />
        <BottomNavigationAction
          label="Create"
          icon={
            <AddCircleOutlineIcon
              sx={{
                color:
                  value === ApplicationLocations.CREATE
                    ? "primary.main"
                    : undefined,
              }}
            />
          }
          component={Link}
          value={ApplicationLocations.CREATE}
          to={ApplicationLocations.CREATE}
          data-testid="navigator-create"
          sx={{
            ...(mode === "dark" ? { color: palette?.text?.primary } : {}),
          }}
        />
        <BottomNavigationAction
          label="Profile"
          icon={
            <AccountCircleOutlinedIcon
              sx={{
                color:
                  value === ApplicationLocations.PROFILE
                    ? "primary.main"
                    : undefined,
              }}
            />
          }
          component={Link}
          value={ApplicationLocations.PROFILE}
          to={ApplicationLocations.PROFILE}
          data-testid="navigator-profile"
          sx={{
            ...(mode === "dark" ? { color: palette?.text?.primary } : {}),
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavigator;
