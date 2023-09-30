import Map from "components/map";
import React from "react";
import { ILocation } from "types/activities/location.dto";

interface ISetOnMapScreenProps {
  onLocationSave?: (location: ILocation | null) => void;
}

const SetOnMapScreen: React.FC<ISetOnMapScreenProps> = ({ onLocationSave }) => {
  return (
    <>
      <Map onLocationSave={onLocationSave} setLocationByMap />
    </>
  );
};

export default SetOnMapScreen;
