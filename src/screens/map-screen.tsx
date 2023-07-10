import { useLocation, useParams } from "react-router-dom";
import Map from "../components/map";
import { useActivities } from "../hooks/use-activities";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";
import { ICustomizedLocationStateDto } from "../types/common/customized-location-state.dto";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = <T extends unknown>() => {
  const { activityId } = useParams();
  const { data: { data = {} } = {}, isLoading } = useActivities<T>({
    id: activityId ? Number(activityId) : undefined,
  });

  const location = useLocation();
  const state = location?.state as ICustomizedLocationStateDto;
  const { from = "" } = state;

  const activityData = !!activityId
    ? [(data as IActivityRestDto)?.activity]
    : (data as IActivityListRestDto)?.activities;

  return (
    <>
      <Map activities={activityData} />
    </>
  );
};

export default MapScreen;
