import React from "react";

import { SwipeableDrawer, Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

interface IDrawerData {
  open?: boolean;
  content?: React.ReactElement;
  onClose?: () => void;
}

interface IDrawerContext {
  toggleDrawer: (drawerData: IDrawerData) => void;
}

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export const DrawerContext = React.createContext<IDrawerContext>(
  {} as IDrawerContext
);

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerData, toggleDrawer] = React.useState<IDrawerData>({
    open: false,
  });

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
        open={Boolean(drawerData?.open)}
        onOpen={() => console.log("wtf")}
        onClose={() => {
          drawerData?.onClose?.();
          toggleDrawer({ open: false, content: undefined });
        }}
        disableDiscovery
        disableSwipeToOpen
        sx={{
          "& .MuiPaper-root": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            pt: 3,
            pb: 2,
            px: 1,
          },
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
