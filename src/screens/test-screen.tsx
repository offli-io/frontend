import React from "react";

import { DrawerContext } from "../assets/theme/drawer-provider";
import Map from "../components/map";

const TestScreen = () => {
  // React.useEffect(
  //   () =>
  //     toggleDrawer({
  //       open: true,
  //       content: <Box sx={{ height: 200 }}>Drawer content</Box>,
  //     }),
  //   []
  // )

  return <Map />;
};

export default TestScreen;
