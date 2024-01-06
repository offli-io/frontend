import React from 'react';

export const useCurrentLocation = () => {
  const [currentCoords, setCurrentCoords] = React.useState<null | GeolocationCoordinates>(null);
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log('Current location', position.coords);
    setCurrentCoords(position.coords);
  });

  return currentCoords;
};
