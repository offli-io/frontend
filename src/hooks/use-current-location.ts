export const useCurrentLocation = () => {
  return navigator.geolocation.getCurrentPosition(function (position) {
    console.log('Current location', position.coords);
    return position.coords;
  });
};
