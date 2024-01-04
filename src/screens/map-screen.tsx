import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { getMapviewActivities } from '../api/activities/requests';
import Map from '../components/map/map';
import { useActivities } from '../hooks/use-activities';
import { IActivityRestDto } from '../types/activities/activity-rest.dto';

//TODO fix this eslint disable
//eslint-disable-next-line
const MapScreen = <T extends unknown>() => {
  const { activityId } = useParams();
  const location = useLocation();
  // if I back navigated from activity detail back to map
  const activityMapId = (location?.state as any)?.activityMapId;

  const { data: { data = {} } = {} } = useActivities<T>({
    params: {
      id: activityId ? Number(activityId) : undefined
    }
    // enabled: !!activityId,
  });

  const { data: { data: mapViewData } = {} } = useQuery(
    ['mapview-activities'],
    () => getMapviewActivities(),
    {
      enabled: !activityId
    }
  );

  const activityData = activityId ? (data as IActivityRestDto)?.activity : mapViewData?.activities;

  return <Map activities={activityData} activityMapId={Number(activityMapId)} />;
};

export default MapScreen;
