import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OffliTextField from '../../../components/offli-text-field';
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
        <OffliTextField
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
          autoCapitalize="on"
          data-testid="activities-search-input"
        />
      )}
    />
  );
};

export default Searchbar;
