import { Box, CardActionArea, DividerProps, SxProps } from "@mui/material";
import logo from "../assets/img/gym.svg";
import L from "leaflet";
import React, { useMemo } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLng, LatLngTuple, Icon } from "leaflet";
import { IActivity } from "../types/activities/activity.dto";
import PlaceIcon from "@mui/icons-material/Place";
import { DrawerContext } from "../assets/theme/drawer-provider";
import ActivityDetailsScreenLayout from "../screens/activity-details-screen/components/activity-details-screen-layout";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import offliMarker from "../assets/img/offli-icon.svg";

// function LocationMarker() {
//   const [position, setPosition] = React.useState<LatLng | null>(null);
//   const map = useMa({
//     click() {
//       map.locate();
//     },
//     locationfound(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//     },
//   });

// const offliMapIcon = new L.Icon({
//   iconUrl: require("../assets/img/offli-icon.svg"),
//   iconRetinaUrl: require("../assets/img/offli-icon.svg"),
//   // iconAnchor: null,
//   // popupAnchor: null,
//   // shadowUrl: null,
//   // shadowSize: null,
//   // shadowAnchor: null,
//   iconSize: new L.Point(60, 75),
//   className: "leaflet-div-icon",
// });

const offliMapIcon = new Icon({
  iconUrl: offliMarker,
  iconSize: [32, 32],
  // popupAnchor:  [-0, -0],
});

const RecenterAutomatically = ({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}) => {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon]);
    }
  }, [lat, lon]);
  return null;
};

interface ILabeledTileProps {
  title?: string;
  imageUrl?: string;
  sx?: SxProps;
  activities?: IActivity[];
  onClick?: (title: string) => void;
  centerPosition?: GeolocationCoordinates;
}

// bratislava position
const position = [48.1486, 17.1077] as LatLngTuple;

const Map: React.FC<ILabeledTileProps> = ({
  title,
  imageUrl,
  sx,
  activities,
  onClick,
  centerPosition,
}) => {
  const [currentLocation, setCurrentLocation] = React.useState<
    GeolocationCoordinates | undefined
  >();

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation(position.coords);
    });
  }, []);

  const { toggleDrawer } = React.useContext(DrawerContext);

  const handleMarkerClick = (activity: IActivity) => {
    toggleDrawer({
      open: true,
      // content: <ActivityDetailsScreenLayout activity={activity} />, //kokotina, spravit novy komponent pre map detail
      content: <div>{activity.title}</div>,
    });
  };

  const isSingleActivity = activities?.length === 1;
  const latLonTupleSingle = [
    activities?.[0]?.location?.coordinates?.lat ?? position[0],
    activities?.[0]?.location?.coordinates?.lon ?? position[1],
  ];

  const latLonTuple =
    currentLocation &&
    ([currentLocation.latitude, currentLocation.longitude] as LatLngTuple);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "fixed" }}>
      <MapContainer
        center={latLonTuple ?? position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=dY2cc1f9EUuag5geOpQB30R31VnRRhl7O401y78cM0NWSvzLf7irQSUGfA4m7Va5"
        />
        {activities?.map(
          // ({ title = "Activity", location = null, id } = {}) =>
          (activity) =>
            activity.location?.coordinates && (
              <Marker
                key={`activity_${activity.id}`}
                icon={offliMapIcon}
                position={[
                  activity.location?.coordinates?.lat ?? position[0],
                  activity.location?.coordinates?.lon ?? position[1],
                ]}
                eventHandlers={{
                  click: () => handleMarkerClick(activity),
                }}
              >
                <Popup>{activity.title}</Popup>
              </Marker>
            )
        )}
        <Marker position={latLonTuple ?? position} icon={offliMapIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <RecenterAutomatically
          lat={
            isSingleActivity ? latLonTupleSingle[0] : currentLocation?.latitude
          }
          lon={
            isSingleActivity ? latLonTupleSingle[1] : currentLocation?.longitude
          }
        />
      </MapContainer>
    </Box>
  );
};
export default Map;
