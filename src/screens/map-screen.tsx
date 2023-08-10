import { useLocation, useParams } from "react-router-dom";
import Map from "../components/map";
import { useActivities } from "../hooks/use-activities";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";
import { ICustomizedLocationStateDto } from "../types/common/customized-location-state.dto";
import { useQuery } from "@tanstack/react-query";
import { getMapviewActivities } from "../api/activities/requests";

interface ILocation {
  lat: number;
  lon: number;
}

const MapScreen = <T extends unknown>() => {
  const { data, isLoading } = useQuery(
    ["mapview-activities"],
    () => getMapviewActivities(),
    {}
  );

  const location = useLocation();
  const state = location?.state as ICustomizedLocationStateDto;
  const { from = "" } = state;

  return (
    <>
      <Map activities={data?.data.activities} />
    </>
  );
};

export default MapScreen;
