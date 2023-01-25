import { Box } from "@mui/material";
import React from "react";
import Map from "../components/map";
import { useActivities } from "../hooks/use-activities";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = () => {
  const { data: { data: { activities = [] } = {} } = {}, isLoading } =
    useActivities<IActivityListRestDto>();

  return (
    <Box>
      <Map activities={activities} />
    </Box>
  );
};

export default MapScreen;
