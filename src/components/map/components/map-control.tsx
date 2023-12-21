import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Divider, IconButton } from '@mui/material';
import React from 'react';
import { useMap } from 'react-leaflet';
import { toast } from 'sonner';

const MapControl: React.FC = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const centerOnLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
      });
    } else {
      toast.error('Geolocation is not available');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 400,
        position: 'absolute',
        top: 75,
        right: 5
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 32,
          bgcolor: 'primary.light',
          borderRadius: 3,
          alignItems: 'center'
        }}>
        <IconButton onClick={handleZoomIn} size="small" color="primary">
          <AddIcon sx={{ color: 'primary.main' }} />
        </IconButton>
        <Divider sx={{ width: '65%', bgcolor: 'primary.main' }} />
        <IconButton onClick={handleZoomOut} size="small" color="primary">
          <RemoveIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          bgcolor: 'primary.light',
          borderRadius: 10,
          mt: 1.5
        }}>
        <IconButton onClick={centerOnLocation} size="medium" color="primary">
          <MyLocationIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MapControl;
