import { Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { OffliUserAgent } from 'types/common/offli-user-agent-enum.dto';
import { setPlatformToStorage } from 'utils/storage.util';
import './App.css';
import { AuthenticationProvider } from './components/context/providers/authentication-provider';
import { CustomizationProvider } from './components/context/providers/customization-provider';
import { DrawerProvider } from './components/context/providers/drawer-provider';
import { HeaderProvider } from './components/context/providers/header-provider';
import { LocationProvider } from './components/context/providers/location-provider';
import Router from './routes/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_, err: any) => {
        if (err?.response?.status === 401) {
          return true; // do not retry, trigger error
        }
        return false;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      cacheTime: 1000 * 300, //5 minutes
      refetchInterval: 1000 * 300, //5 minutes
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 1000 * 300
    },
    mutations: {
      retry: false
    }
  }
});

function App() {
  window.addEventListener('load', function () {
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

  React.useEffect(() => {
    const messageListener = window.addEventListener('message', (nativeEvent) => {
      if ([OffliUserAgent.MobileAndroid, OffliUserAgent.MobileIos].includes(nativeEvent?.data)) {
        setPlatformToStorage(nativeEvent?.data);
      }
    });
    return messageListener;
  }, []);

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SnackbarProvider
        ref={notificationsRef}
        maxSnack={1}
        autoHideDuration={2000}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        action={(key) => (
          <Button onClick={() => handleDismiss(key)} sx={{ color: 'white' }}>
            Dismiss
          </Button>
        )}>
        <BrowserRouter>
          <AuthenticationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CustomizationProvider>
                <Box sx={{ height: '100vh', overflow: 'hidden' }}>
                  <HeaderProvider>
                    <DrawerProvider>
                      <LocationProvider>
                        <Router />
                      </LocationProvider>
                    </DrawerProvider>
                  </HeaderProvider>
                </Box>
              </CustomizationProvider>
            </LocalizationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            {/* 
      Nemozme pouzit query devtooly lebo to pada s tym ze sa na pozadi vytvaraju 2 instancie query client providera
      vid - https://github.com/TanStack/query/issues/1936
      <ReactQueryDevtools initialIsOpen={false} /> */}
          </AuthenticationProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
