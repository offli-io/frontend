import React from 'react';
import { Box, createTheme, Rating, Typography, useTheme, ThemeProvider } from '@mui/material';

interface IUserFeedbackProps {
  feedbackNum?: number;
  createdActivitiesNum?: number;
  username?: string;
}

const CreatorFeedback: React.FC<IUserFeedbackProps> = ({
  feedbackNum,
  createdActivitiesNum,
  username
}) => {
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
    <Box
      sx={{
        width: '90%'
      }}>
      <Typography align="left" variant="h5" sx={{ mt: 3, mb: 1, color: palette?.text?.primary }}>
        Feedback from others
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
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
            value={feedbackNum}
            readOnly={true}
          />
        </ThemeProvider>
        <Typography
          align="left"
          variant="subtitle2"
          sx={{ fontSize: 10, fontWeight: 'normal', maxWidth: '70vw' }}>
          based on the feedback from {createdActivitiesNum} activities {username} has created.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreatorFeedback;
