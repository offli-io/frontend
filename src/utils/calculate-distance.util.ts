import { ILocationCoordinates } from '../types/activities/location.dto';

const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

//This function takes in latitude and longitude of two locations and returns
//the distance between them as the crow flies (in km)

export const calculateDistance = (
  starting?: ILocationCoordinates,
  destination?: ILocationCoordinates
): number | null => {
  if (!starting || !destination) {
    return null;
  }

  const startingLat = degreesToRadians(starting?.lat ?? 0);
  const startingLong = degreesToRadians(starting?.lon ?? 0);
  const destinationLat = degreesToRadians(destination?.lat ?? 0);
  const destinationLong = degreesToRadians(destination.lon ?? 0);

  // Mean radius of the Earth in kilometers
  const radius = 6371.009;

  // Haversine formula
  const deltaLat = destinationLat - startingLat;
  const deltaLong = destinationLong - startingLong;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startingLat) *
      Math.cos(destinationLat) *
      Math.sin(deltaLong / 2) *
      Math.sin(deltaLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = radius * c;

  return distanceInKm;
};
