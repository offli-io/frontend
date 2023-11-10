import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMapviewActivities } from "../api/activities/requests";
import Map from "../components/map/map";
import { useActivities } from "../hooks/use-activities";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = <T extends unknown>() => {
  const { activityId } = useParams();
  
  const { data: { data = {} } = {}, isLoading } = useActivities<T>({
    params: {
      id: activityId ? Number(activityId) : undefined,
    },
    // enabled: !!activityId,
  });

  const {
    data: { data: mapViewData } = {},
    isLoading: areMapViewActivitiesLoading,
  } = useQuery(["mapview-activities"], () => getMapviewActivities(), {
    enabled: !activityId,
  });

  const activityData = !!activityId
    ? (data as IActivityRestDto)?.activity
    : mapViewData?.activities;

  return <Map activities={activityData} />
};

export default MapScreen;
