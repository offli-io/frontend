import React from 'react';
import { createTheme, Rating, useTheme, ThemeProvider } from '@mui/material';

interface IUserFeedbackProps {
  ratingValue?: number;
}

const OffliRating: React.FC<IUserFeedbackProps> = ({ ratingValue }) => {
  const { palette } = useTheme();

  const theme = createTheme({
    components: {
      MuiRating: {
        styleOverrides: {
          iconFilled: {
            color: palette?.primary?.main
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Rating
        sx={{
          fontSize: '2rem',
          '& .MuiRating-icon': {
            width: '2.5rem'
          },
          mt: 1,
          mb: 1
        }}
        name="feedback"
        size="large"
        value={ratingValue}
        readOnly={true}
      />
    </ThemeProvider>
  );
};

export default OffliRating;
