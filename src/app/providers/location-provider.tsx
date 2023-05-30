import React from "react";

import { SwipeableDrawer, Box } from "@mui/material";
import { useUser } from "../../hooks/use-user";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { ILocation } from "../../types/activities/location.dto";

interface ILocationContext {
  location?: ILocation | null;
  setLocation?: (location?: ILocation | null) => void;
}

export const LocationContext = React.createContext<ILocationContext>(
  {} as ILocationContext
);

export const LOCATION_STORAGE_KEY = "current_location";

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const storageLocation = sessionStorage.getItem(LOCATION_STORAGE_KEY);
  const _storageLocation = !!storageLocation
    ? JSON.parse(storageLocation)
    : null;

  const { data: { data: userData = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const [location, _setLocation] = React.useState<ILocation | undefined | null>(
    _storageLocation ?? userData?.location
  );

  const setLocation = React.useCallback((location?: ILocation | null) => {
    _setLocation(location);
    sessionStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  }, []);

  React.useEffect(() => {
    // set default location value when component completely renders
    if (!location) {
      if (!!_storageLocation) {
        _setLocation(_storageLocation);
      } else if (!!userData?.location) {
        _setLocation(userData?.location);
      }
    }
  }, [_storageLocation, userData?.location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
