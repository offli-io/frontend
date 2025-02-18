import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import OffliRating from '../../../components/offli-rating';

interface IUserFeedbackProps {
  creator_feedback: number;
  // activities_created_last_month_count?: number;
  username?: string;
}

const CreatorFeedback: React.FC<IUserFeedbackProps> = ({
  creator_feedback,
  // activities_created_last_month_count,
  username
}) => {
  const { palette } = useTheme();

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
        <Typography align="left" variant="h2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
          {`${creator_feedback % 1 !== 0 ? creator_feedback?.toFixed(1) : creator_feedback} of 5`}
        </Typography>
        <OffliRating ratingValue={creator_feedback} />
        <Typography
          align="left"
          variant="subtitle2"
          sx={{ fontSize: 10, fontWeight: 'normal', maxWidth: '80vw' }}>
          {/*based on the feedback from {activities_created_last_month_count} activities {username} has*/}
          {/*created last month.*/}
          based on the feedback from activities {username} has created.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreatorFeedback;
