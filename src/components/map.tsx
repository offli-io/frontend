import { Box, CardActionArea, DividerProps, SxProps } from "@mui/material";
import logo from "../assets/img/gym.svg";
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
import { LatLng, LatLngTuple } from "leaflet";

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
  onClick?: (title: string) => void;
  centerPosition?: GeolocationCoordinates;
}

const position = [48.1486, 17.1077] as LatLngTuple;

const Map: React.FC<ILabeledTileProps> = ({
  title,
  imageUrl,
  sx,
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={latLonTuple ?? position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <RecenterAutomatically
          lat={currentLocation?.latitude}
          lon={currentLocation?.longitude}
        />
      </MapContainer>
    </Box>
  );
};
export default Map;
