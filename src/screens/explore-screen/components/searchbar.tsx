import React from 'react';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from '../../../types/common/applications-locations.dto';

const Searchbar = () => {
  const navigate = useNavigate();

  return (
    <Autocomplete
      options={[]}
      forcePopupIcon={false}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          pr: 0
        }
      }}
      onFocus={() => navigate(ApplicationLocations.SEARCH)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="What activity or user are you looking for?"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />{' '}
              </InputAdornment>
            )
          }}
          sx={{
            '& input::placeholder': {
              fontSize: 14,
              color: 'primary.main',
              fontWeight: 400,
              opacity: 1,
              pl: 1
            },
            '& fieldset': { border: 'none' },
            backgroundColor: ({ palette }) => palette?.primary?.light,
            borderRadius: '10px'
          }}
          data-testid="activities-search-input"
        />
      )}
    />
  );
};

export default Searchbar;
