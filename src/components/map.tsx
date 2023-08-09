import { Box, CardActionArea, DividerProps, SxProps } from "@mui/material";
import logo from "../assets/img/gym.svg";
import L from "leaflet";
import React from "react";
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
import MarkerClusterGroup from "react-leaflet-cluster";
import { LatLng, LatLngTuple } from "leaflet";
import { IActivity } from "../types/activities/activity.dto";
import PlaceIcon from "@mui/icons-material/Place";
import { DrawerContext } from "../assets/theme/drawer-provider";
import MapDrawerDetail from "../screens/map-screen/components/map-drawer-detail";
import { CustomizationContext } from "../assets/theme/customization-provider";
import markerIcon from "../assets/img/location-marker.svg";

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

// const iconPerson = new L.Icon({
//   iconUrl: require("../img/marker-pin-person.svg"),
//   iconRetinaUrl: require("../img/marker-pin-person.svg"),
//   // iconAnchor: null,
//   // popupAnchor: null,
//   // shadowUrl: null,
//   // shadowSize: null,
//   // shadowAnchor: null,
//   iconSize: new L.Point(60, 75),
//   className: "leaflet-div-icon",
// });

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

const offliMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [45, 45], // Adjust the size of the icon as needed
  iconAnchor: [22.5, 22.5],
});

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
  const { mode } = React.useContext(CustomizationContext);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation(position.coords);
    });
  }, []);

  const isSingleActivity = activities?.length === 1;
  const latLonTupleSingle = [
    activities?.[0]?.location?.coordinates?.lat ?? position[0],
    activities?.[0]?.location?.coordinates?.lon ?? position[1],
  ];

  const latLonTuple =
    currentLocation &&
    ([currentLocation.latitude, currentLocation.longitude] as LatLngTuple);

  const { toggleDrawer } = React.useContext(DrawerContext);

  const handleMarkerClick = (activityId?: number) => {
    toggleDrawer({
      open: true,
      content: <MapDrawerDetail activityId={activityId} />,
    });
  };

  return (
    <Box sx={{ width: "100%", height: "100%", position: "fixed" }}>
      <MapContainer
        center={latLonTuple ?? position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <TileLayer
          attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          url={`https://{s}.tile.jawg.io/jawg-${
            mode === "light" ? "sunny" : "dark"
          }/{z}/{x}/{y}{r}.png?access-token=dY2cc1f9EUuag5geOpQB30R31VnRRhl7O401y78cM0NWSvzLf7irQSUGfA4m7Va5`}
        />
        <MarkerClusterGroup chunkedLoading>
          {activities?.map(
            ({ title = "Activity", location = null, id } = {}) =>
              location?.coordinates && (
                <Marker
                  key={`activity_${id}`}
                  position={[
                    location?.coordinates?.lat ?? position[0],
                    location?.coordinates?.lon ?? position[1],
                  ]}
                  eventHandlers={{
                    click: () => handleMarkerClick(id),
                  }}
                  icon={offliMarkerIcon}
                >
                  {/* 
                Maybe omit popup because activity detail will be displayed with drawer
                <Popup>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    {title}
                  </Typography>
                </Popup>{" "} */}
                </Marker>
              )
          )}
          <Marker position={latLonTuple ?? position} icon={offliMarkerIcon}>
            <Popup>You are here</Popup>
          </Marker>
          <RecenterAutomatically
            lat={
              isSingleActivity
                ? latLonTupleSingle[0]
                : currentLocation?.latitude
            }
            lon={
              isSingleActivity
                ? latLonTupleSingle[1]
                : currentLocation?.longitude
            }
          />
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  );
};
export default Map;
