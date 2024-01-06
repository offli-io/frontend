import React, { useEffect } from 'react';

export const useCurrentLocation = () => {
  const [currentCoords, setCurrentCoords] = React.useState<null | GeolocationCoordinates>(null);
  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log('Current location', position.coords);
        setCurrentCoords(position.coords);
      });
    };

    // Call immediately
    updateLocation();

    // Set up interval to call every minute
    const intervalId = setInterval(updateLocation, 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return currentCoords;
};
