import { AuthenticationContext } from "../assets/theme/authentication-provider";
import BottomNavigator from "../components/bottom-navigator/bottom-navigator";
import React from "react";
import Routes from "../routes/routes";
import OffliHeader from "../components/offli-header/offli-header";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import BackHeader from "../components/back-header";
import { useUsers } from "../hooks/use-users";
import { IPersonExtended } from "../types/activities/activity.dto";
import { useUser } from "../hooks/use-user";
interface ILayoutProps {
  children?: React.ReactNode;
}

export const NOT_EXACT_UNALLOWED_URLS = [
  "/request",
  "/map/",
  "/profile/buddy",
  "/profile/user",
];

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { stateToken, userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const [displayHeader, setDisplayHeader] = React.useState(true);
  const [displayBottomNavigator, setDisplayBottomNavigator] =
    React.useState(true);

  const { data: { data } = {}, isLoading } = useUser({
    id: userInfo?.id,
  });

  const isBuddyRequest = location?.pathname?.includes("/profile/request");

  React.useEffect(() => {
    if (!!data && !data?.username && stateToken) {
      navigate(ApplicationLocations.CHOOSE_USERNAME_GOOGLE);
    }
  }, [data, stateToken]);

  React.useEffect(() => {
    if (!!data && !data?.location && stateToken) {
      // TODO when on BE will be patch implemented
      navigate(ApplicationLocations.CHOOSE_LOCATION);
    }
  }, [data, stateToken]);

  React.useEffect(() => {
    if (
      [
        // locations where we want to hide header
        ApplicationLocations.CHOOSE_LOCATION,
        ApplicationLocations.CHOOSE_USERNAME_GOOGLE,
      ].includes(location?.pathname as ApplicationLocations)
    ) {
      setDisplayHeader(false);
    } else {
      setDisplayHeader(true);
    }
  }, [location]);

  React.useEffect(() => {
    if (
      [
        ApplicationLocations.CHOOSE_USERNAME_GOOGLE,
        ApplicationLocations.CHOOSE_LOCATION,
      ].includes(location?.pathname as ApplicationLocations)
    ) {
      setDisplayBottomNavigator(false);
    } else {
      setDisplayBottomNavigator(true);
    }
  }, [location]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "stretch",
          overflow: "hidden",
        }}
      >
        {/* TODO backHeader and diusplayheader better naming */}
        {stateToken && displayHeader && <OffliHeader sx={{ width: "100%" }} />}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflow: "scroll",
            bgcolor: palette.background.default,
          }}
        >
          <Routes />
        </Box>
        {stateToken && displayBottomNavigator && !isBuddyRequest && (
          <BottomNavigator sx={{ height: "100%" }} />
        )}
      </Box>
    </>
  );
};
