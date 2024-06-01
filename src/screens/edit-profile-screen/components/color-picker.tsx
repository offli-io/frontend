import { Box, Typography } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';
import OffliTextField from '../../../components/offli-text-field';

export interface IColorProps {
  color: string;
  onColorChange: (color: string | null) => void;
}

const ColorPicker: React.FC<IColorProps> = ({ onColorChange, color }) => {
  const [temporaryColor, setTemporaryColor] = React.useState<string>(color);

  const setTemporaryColorDebounced = useDebouncedCallback(
    // function
    (value: string) => {
      setTemporaryColor(value);
    },
    // delay in ms
    200
  );

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //TODO validate color HEX
    setTemporaryColorDebounced(
      event.target.value?.startsWith('#') ? event.target?.value : `#${event.target.value}`
    );
  };

  const handleTemporaryColorChange = React.useCallback((color: string) => {
    setTemporaryColorDebounced(color);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Choose your profile background color
      </Typography>
      <HexColorPicker
        color={temporaryColor}
        onChange={handleTemporaryColorChange}
        style={{ width: '80%' }}
      />
      <OffliTextField
        sx={{ width: '60%', mt: 2 }}
        InputProps={{
          style: { textAlign: 'center' },
          inputProps: {
            style: {
              textAlign: 'center'
            }
          }
        }}
        placeholder={temporaryColor}
        onChange={handleColorChange}
        // defaultValue={color}
      />
      <OffliButton sx={{ width: '60%', mt: 2 }} onClick={() => onColorChange(temporaryColor)}>
        Select
      </OffliButton>
    </Box>
  );
};

export default ColorPicker;
