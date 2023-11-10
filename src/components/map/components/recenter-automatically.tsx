import { LatLngTuple } from "leaflet";
import React from "react";
import { useMap } from "react-leaflet";
import { ILocation } from "types/activities/location.dto";

const RecenterAutomatically = ({
  lat,
  lon,
  selectedLocation,
  position,
}: {
  selectedLocation?: ILocation | null;
  lat?: number;
  lon?: number;
  position: LatLngTuple;
}) => {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon]);
    }
  }, [lat, lon]);

  React.useEffect(() => {
    if (selectedLocation) {
      map.setView([
        selectedLocation?.coordinates?.lat ?? position[0],
        selectedLocation?.coordinates?.lon ?? position[1],
      ]);
    }
  }, [selectedLocation]);

  return null;
};

export default RecenterAutomatically;