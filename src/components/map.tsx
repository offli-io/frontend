import { Box, SxProps } from "@mui/material";
import L, { LatLngTuple } from "leaflet";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import markerIcon from "../assets/img/location-marker.svg";
import { CustomizationContext } from "../assets/theme/customization-provider";
import { DrawerContext } from "../assets/theme/drawer-provider";
import MapDrawerDetail from "../screens/map-screen/components/map-drawer-detail";
import { IActivity } from "../types/activities/activity.dto";
import { IMapViewActivityDto } from "../types/activities/mapview-activities.dto";

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
  activities?: IActivity | IMapViewActivityDto[];
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

  const isSingleActivity = !Array.isArray(activities);
  const latLonTupleSingle = React.useMemo(() => {
    if (isSingleActivity) {
      return [
        activities?.location?.coordinates?.lat ?? position[0],
        activities?.location?.coordinates?.lon ?? position[1],
      ];
    }
    return [
      (activities?.[0] as IMapViewActivityDto)?.lat ?? position[0],
      (activities?.[0] as IMapViewActivityDto)?.lon ?? position[1],
    ];
  }, [activities, isSingleActivity]);

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
          {isSingleActivity ? (
            <Marker
              // key={`activity_${id}`}
              position={[
                latLonTupleSingle[0] ?? position[0],
                latLonTupleSingle[1] ?? position[1],
              ]}
              eventHandlers={{
                click: () => handleMarkerClick(activities?.id),
              }}
              icon={offliMarkerIcon}
            ></Marker>
          ) : (
            activities?.map(
              ({ id, lat, lon }) =>
                id && (
                  <Marker
                    key={`activity_${id}`}
                    position={[lat ?? position[0], lon ?? position[1]]}
                    eventHandlers={{
                      click: () => handleMarkerClick(id),
                    }}
                    icon={offliMarkerIcon}
                  ></Marker>
                )
            )
          )}
          <Marker position={latLonTuple ?? position} icon={offliMarkerIcon}>
            <Popup>You are here</Popup>
            {/* TODO: custom Person marker instead of text "you are here" */}
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
