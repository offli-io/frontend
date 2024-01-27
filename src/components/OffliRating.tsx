import React from 'react';
import { Rating } from '@mui/material';

interface IUserFeedbackProps {
  ratingValue?: number;
}

const OffliRating: React.FC<IUserFeedbackProps> = ({ ratingValue }) => {
  return (
    <Rating
      sx={{
        fontSize: '2rem',
        '& .MuiRating-icon': {
          width: '2.5rem'
        },
        '& .MuiSvgIcon-root': {
          color: 'inherit'
        },
        mt: 1,
        mb: 1
      }}
      name="feedback"
      size="large"
      value={ratingValue}
      readOnly={true}
    />
  );
};

export default OffliRating;
