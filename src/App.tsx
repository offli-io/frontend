import { Box, Button } from "@mui/material";
import "./App.css";
import Router from "./routes/router";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthenticationProvider } from "./assets/theme/authentication-provider";
import { ReactNode } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useServiceInterceptors } from "./hooks/use-service-interceptors";
import { SnackbarKey, SnackbarProvider } from "notistack";
import { DrawerProvider } from "./assets/theme/drawer-provider";
import { CustomizationProvider } from "./assets/theme/customization-provider";
import { gapi } from "gapi-script";
import { useGoogleCalendar } from "./hooks/use-google-calendar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { LocationProvider } from "./app/providers/location-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      cacheTime: 1000 * 300, //5 minutes
      refetchInterval: 1000 * 300, //5 minutes
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 1000 * 300,
    },
    mutations: {
      retry: false,
    },
  },
});

// declare module "react-query/types/react/QueryClientProvider" {
//   interface QueryClientProviderProps {
//     children?: ReactNode;
//   }
// }

function App() {
  window.addEventListener("load", function () {
    setTimeout(function () {
      // This hides the address bar:
      window.scrollTo(0, 1);
    }, 0);
  });
  const notificationsRef = React.createRef<any>();

  const handleDismiss = React.useCallback(
    (key: SnackbarKey) => {
      notificationsRef.current.closeSnackbar(key);
    },
    [notificationsRef]
  );
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SnackbarProvider
        ref={notificationsRef}
        maxSnack={1}
        autoHideDuration={3000}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        action={(key) => (
          <Button onClick={() => handleDismiss(key)} sx={{ color: "white" }}>
            Dismiss
          </Button>
        )}
      >
        <AuthenticationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CustomizationProvider>
              <Box sx={{ height: "100vh", overflow: "hidden" }}>
                <DrawerProvider>
                  <LocationProvider>
                    <Router />
                  </LocationProvider>
                </DrawerProvider>
              </Box>
            </CustomizationProvider>
          </LocalizationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthenticationProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
