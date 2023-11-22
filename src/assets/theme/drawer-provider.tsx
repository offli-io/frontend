import React from "react";

import {
  SwipeableDrawer,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

interface IDrawerData {
  open?: boolean;
  content?: React.ReactElement;
  variant?: "permanent" | "persistent" | "temporary";
  onClose?: () => void;
}

interface IDrawerContext {
  toggleDrawer: (drawerData: IDrawerData) => void;
}

const Puller = styled(Box)(({ theme }) => ({
  width: 50,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 30,
  position: "absolute",
  top: 15,
  left: "calc(50% - 25px)",
}));

export const DrawerContext = React.createContext<IDrawerContext>(
  {} as IDrawerContext
);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerData, toggleDrawer] = React.useState<IDrawerData>({
    open: false,
  });
  const { breakpoints } = useTheme();
  const upMd = useMediaQuery(breakpoints.up("md"));

  const { pathname } = useLocation();

  // React.useEffect(() => {
  //   // hide drawer when route changes
  //   // cant do because window.location.href is not updated somehow -> I think it is evaluated in the time function is called
  //   // and not in any other time(for example upon re-render)
  //   if (!!window.location.href) {
  //     toggleDrawer({
  //       open: false,
  //       content: undefined,
  //     });
  //   }
  // }, [window.location.href]);

  React.useEffect(() => {
    // on pathname change close the drawer
    if (!!pathname && pathname?.length > 0) {
      toggleDrawer({
        open: false,
      });
    }
  }, [pathname]);

  return (
    <DrawerContext.Provider value={{ toggleDrawer }}>
      {children}
      <SwipeableDrawer
        anchor="bottom"
        // variant="persistent"
        open={Boolean(drawerData?.open)}
        onOpen={() => console.log("wtf")}
        onClose={() => {
          drawerData?.onClose?.();
          toggleDrawer({ open: false, content: undefined });
        }}
        disableDiscovery
        disableSwipeToOpen
        // allowSwipeInChildren
        sx={{
          "& .MuiPaper-root": {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            pt: 5,
            pb: 2,
            px: 1,
            ...(upMd
              ? {
                  width: 450,
                  boxSizing: "border-box",
                }
              : {}),
          },
          ...(upMd
            ? {
                left: "50%",
                transform: "translate(-50%)",
                width: 450,
              }
            : {}),
        }}
      >
        <Box
          style={{
            // height: "400px", // Specify the desired height for the drawer
            overflow: "auto", // Enable scrolling for overflowing content
          }}
        >
          <Puller />
          {drawerData?.content}
        </Box>
      </SwipeableDrawer>
    </DrawerContext.Provider>
  );
};
