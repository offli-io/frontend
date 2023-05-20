import { Box } from "@mui/material";
import React from "react";

import { DrawerContext } from "../assets/theme/drawer-provider";
import Map from "../components/map";
import { ICarouselItem, MobileCarousel } from "../components/mobile-carousel";

const data = [
  {
    src: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
    title: "Today",
    description: "17.01.2022",
    id: "1",
  },
  {
    src: "https://images.unsplash.com/photo-1527549993586-dff825b37782",
    title: "Wed",
    description: "18.01.2022",
    id: "2",
    selected: true,
  },
  {
    src: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    title: "Thu",
    description: "19.01.2022",
    id: "3",
  },
  {
    src: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    title: "Fri",
    description: "20.01.2022",
    id: "4",
  },
];
const TestScreen = () => {
  // React.useEffect(
  //   () =>
  //     toggleDrawer({
  //       open: true,
  //       content: <Box sx={{ height: 200 }}>Drawer content</Box>,
  //     }),
  //   []
  // )

  const [_data, setData] = React.useState(data);

  const handleCarouselItemSelect = React.useCallback(
    (_item?: ICarouselItem) => {
      const updatedData = _data?.map((item) => ({
        ...item,
        selected: item?.id === _item?.id ? true : false,
      }));
      setData(updatedData);
    },
    []
  );

  return (
    <Box sx={{ p: 4 }}>
      <MobileCarousel
        items={_data}
        onItemSelect={handleCarouselItemSelect}
        title="Dates"
      />
    </Box>
  );
};

export default TestScreen;
