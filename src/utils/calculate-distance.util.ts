import { ILocationCoordinates } from '../types/activities/location.dto';

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//

const degreesToRadians = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return radians;
};

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

  // Radius of the Earth in kilometers
  const radius = 6571;

  // Haversine equation
  const distanceInMeters: number =
    Math.acos(
      Math.sin(startingLat) * Math.sin(destinationLat) +
        Math.cos(startingLat) * Math.cos(destinationLat) * Math.cos(startingLong - destinationLong)
    ) * radius;

  return Math.floor(distanceInMeters * 1000);
};

// export function calculateDistance(
//   firstCoordinatesTuple?: ILocationCoordinates,
//   secondCoordinatesTuple?: ILocationCoordinates
// ) {
//   if (!firstCoordinatesTuple || !secondCoordinatesTuple) {
//     return null;
//   }
//   var R = 6371; // km
//   const { lat: lat1 = 0, lon: lon1 = 0 } = firstCoordinatesTuple;
//   const { lat: lat2 = 0, lon: lon2 = 0 } = secondCoordinatesTuple;

//   //   var dLat = toRad(lat2 - lat1);
//   //   var dLon = toRad(lon2 - lon1);
//   //   const lat1Rad = toRad(lat1);
//   //   const lat2Rad = toRad(lat2);

//   //   var a =
//   //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   //     Math.sin(dLon / 2) *
//   //       Math.sin(dLon / 2) *
//   //       Math.cos(lat1Rad) *
//   //       Math.cos(lat2Rad);
//   //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   //   var d = R * c;
//   //   return d;
//   const a = lat1 - lat2;
//   const b = lon1 - lon2;

//   return Math.hypot(a, b);
// }

// const degreesToRadians = (degrees: number) => {
//   var radians = (degrees * Math.PI) / 180;
//   return radians;
// };
