import { Autocomplete, Box, SxProps, TextField } from "@mui/material";
import L, { LatLngTuple } from "leaflet";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import markerIcon from "../../assets/img/location-marker.svg";
import { CustomizationContext } from "../../assets/theme/customization-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import MapDrawerDetail from "../../screens/map-screen/components/map-drawer-detail";
import { IActivity } from "../../types/activities/activity.dto";
import { IMapViewActivityDto } from "../../types/activities/mapview-activities.dto";
import wavePeople from "../../assets/img/your-location.svg";
import {
  getLocationFromQueryFetch,
  getPlaceFromCoordinates,
} from "api/activities/requests";
import { useQuery } from "@tanstack/react-query";
import { ILocation } from "types/activities/location.dto";
import MapControl from "./components/map-control";
import { mapExternalApiOptions } from "utils/map-location-value.util";
import { useDebounce } from "use-debounce";
import SaveButton from "./components/save-button";
import RecenterAutomatically from "./components/recenter-automatically";
import BackButton from "./components/back-button";
import UserLocationLoader from "./components/user-location-loader";

// bratislava position
const position = [48.1486, 17.1077] as LatLngTuple;

interface ILabeledTileProps {
  sx?: SxProps;
  activities?: IActivity | IMapViewActivityDto[];
  onClick?: (title: string) => void;
  centerPosition?: GeolocationCoordinates;
  setLocationByMap?: boolean;
  onLocationSave?: (location: ILocation | null) => void;
}

const offliMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [45, 45], // Adjust the size of the icon as needed
  iconAnchor: [22.5, 22.5],
});

const youAreHereIcon = new L.Icon({
  iconUrl: wavePeople,
  iconSize: [45, 45], // Adjust the size of the icon as needed
  iconAnchor: [22.5, 22.5],
});

const Map: React.FC<ILabeledTileProps> = ({
  sx,
  activities,
  onClick,
  centerPosition,
  setLocationByMap = false,
  onLocationSave,
}) => {
  const [currentLocation, setCurrentLocation] = React.useState<
    GeolocationCoordinates | undefined
  >();
  const [isUserLocationLoading, setIsUserLocationLoading] =
    React.useState(false);
  const { mode } = React.useContext(CustomizationContext);
  const [pendingLatLngTuple, setPendingLatLngTuple] =
    React.useState<LatLngTuple | null>(null);
  //const map = useMap();
  const [placeQuery, setPlaceQuery] = React.useState("");
  const [selectedLocation, setSelectedLocation] =
    React.useState<ILocation | null>(null);

  React.useEffect(() => {
    setIsUserLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setIsUserLocationLoading(false);
        setCurrentLocation(position.coords);
      },
      function (error) {
        // Don't display nothing yet, just reset loader state
        setIsUserLocationLoading(false);
      }
    );
  }, []);

  const [queryString] = useDebounce(placeQuery, 1000);

  const { data, isLoading } = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString,
    }
  );

  const {
    data: placeFromCoordinatesData,
    // isLoading: isPlaceFromCoordinatesDataLoading,
    isFetching: isPlaceFromCoordinatesDataLoading,
  } = useQuery(
    ["locations", pendingLatLngTuple],
    () =>
      getPlaceFromCoordinates(
        Number(pendingLatLngTuple?.[0]),
        Number(pendingLatLngTuple?.[1])
      ),
    {
      enabled: !!setLocationByMap && !!pendingLatLngTuple,
      onSuccess: (data) => {
        const nearestResult = data?.results?.[0];

        if (nearestResult) {
          onLocationSave?.({
            name: nearestResult?.formatted,
            coordinates: {
              lat: nearestResult?.lat,
              lon: nearestResult?.lon,
            },
          });
        } else {
          onLocationSave?.(null);
        }
      },
    }
  );

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

  const handleLocationSave = (location: L.LatLng) => {
    setPendingLatLngTuple([location.lat, location.lng]);
    // onLocationSave?.()
  };

  const handleMapDismiss = () => {
    onLocationSave?.(null);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={latLonTuple ?? position}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          // filter: !isUserLocationLoading ? "brightness(0.5)" : undefined,
          // filter: "brightness(0.5)",
        }}
        zoomControl={false}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            zIndex: 400,
            position: "fixed",
            top: 50,
          }}
        >
          <Autocomplete
            value={selectedLocation}
            options={mapExternalApiOptions(data?.results)}
            sx={{
              width: "95%",
              display: "flex",
              justifyContent: "center",
              my: 1.5,
              bgcolor: "primary.light",
              borderRadius: 3,
              "& .MuiAutocomplete-clearIndicator": { display: "none" },
              "& .MuiSvgIcon-root": { color: "primary.main" },
            }}
            loading={isLoading}
            onChange={(e, locationObject) => {
              setSelectedLocation({
                name: locationObject?.name ?? "",
                coordinates: locationObject?.coordinates,
              });
            }}
            inputValue={selectedLocation?.name}
            getOptionLabel={(option) => String(option?.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={"Search places"}
                onChange={(e) => setPlaceQuery(e.target.value)}
                sx={{
                  "& input::placeholder": {
                    fontSize: 16,
                    color: "primary.main",
                    fontWeight: 400,
                    opacity: 1,
                    pl: 1,
                  },
                  "& fieldset": { border: "none" },
                  backgroundColor: ({ palette }) => palette?.primary?.light,
                  borderRadius: "10px",
                }}
              />
            )}
            data-testid="activity-place-input"
          />
        </Box>
        <MapControl />
        <TileLayer
          // attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          url={`https://{s}.tile.jawg.io/jawg-${
            mode === "light" ? "sunny" : "dark"
          }/{z}/{x}/{y}{r}.png?access-token=dY2cc1f9EUuag5geOpQB30R31VnRRhl7O401y78cM0NWSvzLf7irQSUGfA4m7Va5`}
        />

        {setLocationByMap ? (
          <>
            <BackButton onClick={handleMapDismiss} />
            <SaveButton
              onClick={handleLocationSave}
              isLoading={isPlaceFromCoordinatesDataLoading}
            />
            <img
              src={markerIcon}
              alt="marker"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 400,
              }}
            />
          </>
        ) : (
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
          </MarkerClusterGroup>
        )}

        {latLonTuple ? (
          <Marker position={latLonTuple} icon={youAreHereIcon}>
            <Popup>You are here</Popup>
          </Marker>
        ) : null}

        <RecenterAutomatically
          lat={
            isSingleActivity ? latLonTupleSingle[0] : currentLocation?.latitude
          }
          lon={
            isSingleActivity ? latLonTupleSingle[1] : currentLocation?.longitude
          }
          selectedLocation={selectedLocation}
          position={position}
        />
      </MapContainer>
      {!isSingleActivity ? (
        <UserLocationLoader isLoading={isUserLocationLoading} />
      ) : null}
    </Box>
  );
};
export default Map;
