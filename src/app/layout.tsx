import { Box, SxProps, useTheme } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { isIOS, isSafari } from "utils/is-ios-device.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import BottomNavigator from "../components/bottom-navigator/bottom-navigator";
import OffliHeader from "../components/offli-header/offli-header";
import { useUser } from "../hooks/use-user";
import Routes from "../routes/routes";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { getAuthToken } from "../utils/token.util";
import { HeaderContext } from "./providers/header-provider";

interface ILayoutProps {
  children?: React.ReactNode;
}

interface ILayoutContext {
  contentDivRef?: React.MutableRefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  layoutStyle?: SxProps;
  setSwipeHandlers?: React.Dispatch<
    React.SetStateAction<ISwipeHandlers | null>
  >;
}

export const LayoutContext = React.createContext<ILayoutContext>(
  {} as ILayoutContext
);

export const NOT_EXACT_UNALLOWED_URLS = [
  "/request",
  "/map/",
  "/profile/buddy",
  "/profile/user",
];

export interface ISwipeHandlers {
  right?: () => void;
  left?: () => void;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const { stateToken, userInfo, setStateToken, setUserInfo } = React.useContext(
    AuthenticationContext
  );
  const token = getAuthToken();
  const userIdFromStorage = localStorage.getItem("userId");
  const { setHeaderRightContent } = React.useContext(HeaderContext);
  const contentDivRef = React.useRef<HTMLDivElement | null>(null);
  const [swipeHandlers, setSwipeHandlers] =
    React.useState<ISwipeHandlers | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const { ref, ...restHandlers } = useSwipeable({
    onSwipedRight: swipeHandlers?.right,
    onSwipedLeft: swipeHandlers?.left,
  });

  const [displayHeader, setDisplayHeader] = React.useState(true);
  const [displayBottomNavigator, setDisplayBottomNavigator] =
    React.useState(true);

  const { data: { data } = {}, isLoading } = useUser({
    id: userInfo?.id,
    onSuccess: (data) =>
      setUserInfo?.((basicInfo) => ({
        ...basicInfo,
        email: data?.data?.email,
      })),
  });

  const isBuddyRequest = location?.pathname?.includes("/profile/request");
  const isUserProfile = location?.pathname?.includes("/profile/user");

  React.useEffect(() => {
    //reset the header right content on route changes, in the future might be subject to change
    setHeaderRightContent(null);
  }, [location]);

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
      ].includes(location?.pathname as ApplicationLocations)
    ) {
      setDisplayHeader(false);
    } else {
      setDisplayHeader(true);
    }
  }, [location]);

  React.useEffect(() => {
    if (
      [ApplicationLocations.CHOOSE_LOCATION].includes(
        location?.pathname as ApplicationLocations
      )
    ) {
      setDisplayBottomNavigator(false);
    } else {
      setDisplayBottomNavigator(true);
    }
  }, [location]);

  React.useEffect(() => {
    if (
      !!token &&
      !!userIdFromStorage &&
      ["/", "/login", "/register"].includes(location?.pathname)
    ) {
      setStateToken(token);
      setUserInfo?.((values) => ({ ...values, id: Number(userIdFromStorage) }));
      navigate(ApplicationLocations.EXPLORE);
    }
  }, [token]);

  const refPassthrough = (el?: any) => {
    // call useSwipeable ref prop with el
    ref(el);

    // set myRef el so you can access it yourself
    contentDivRef.current = el;
  };

  const addContentPadding = React.useMemo(
    () =>
      [ApplicationLocations.EXPLORE, ApplicationLocations.ACTIVITIES].includes(
        location?.pathname as ApplicationLocations
      ),
    [location?.pathname]
  );

  const isIOSSafari = isIOS() && isSafari();

  return (
    <LayoutContext.Provider
      value={{
        contentDivRef,
        setSwipeHandlers,
        // layoutStyle
      }}
    >
      <Box
        sx={{
          width: "100%",
          // height: isIOSSafari ? `calc(100vh - 20px)` : "100vh",
          // height: isIOSSafari ? "98vh" : "100vh",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "stretch",
          overflow: "hidden",
        }}
        className="layout-parent"
      >
        {/* TODO backHeader and diusplayheader better naming */}
        {stateToken && displayHeader && <OffliHeader sx={{ width: "100%" }} />}
        <Box
          // onScroll={onscroll}
          // onScrollEnd={() => console.log("scroll end")}
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            bgcolor: palette.background.default,
            boxSizing: "border-box",
            px: addContentPadding ? 1 : 0,
            // ...layoutStyle,
          }}
          {...restHandlers}
          ref={refPassthrough}
        >
          <Routes />
        </Box>
        {stateToken &&
          displayBottomNavigator &&
          !isBuddyRequest &&
          !isUserProfile && <BottomNavigator sx={{ height: "100%" }} />}
      </Box>
    </LayoutContext.Provider>
  );
};
