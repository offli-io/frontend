import React from 'react';

export const useCurrentLocation = () => {
  const [currentCoords, setCurrentCoords] = React.useState<null | GeolocationCoordinates>(null);
  navigator.geolocation.getCurrentPosition(function (position) {
    setCurrentCoords(position.coords);
  });

  return currentCoords;
};
