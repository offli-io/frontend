import { Box } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import Map from "../components/map";
import { useActivities } from "../hooks/use-activities";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = <T extends unknown>() => {
  const { activityId } = useParams();
  const { data: { data = {} } = {}, isLoading } = useActivities<T>({
    id: activityId,
  });

  const activityData = !!activityId
    ? [(data as IActivityRestDto)?.activity]
    : (data as IActivityListRestDto)?.activities;

  return (
    <Box>
      <Map activities={activityData} />
    </Box>
  );
};

export default MapScreen;
