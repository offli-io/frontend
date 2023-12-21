import Map from 'components/map/map';
import React from 'react';
import { IActivity } from 'types/activities/activity.dto';
import { ILocation } from 'types/activities/location.dto';

interface ISetOnMapScreenProps {
  onLocationSave?: (location: ILocation | null) => void;
  activity?: IActivity;
}

const SetOnMapScreen: React.FC<ISetOnMapScreenProps> = ({ onLocationSave, activity }) => {
  return (
    <>
      <Map onLocationSave={onLocationSave} activities={activity} setLocationByMap />
    </>
  );
};

export default SetOnMapScreen;
