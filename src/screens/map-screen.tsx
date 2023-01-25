import { Box } from "@mui/material";
import React from "react";
import Map from "../components/map";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = () => {
  return (
    <Box>
      <Map />
    </Box>
  );
};

export default MapScreen;
