import { Box, Typography } from '@mui/material';
import React from 'react';
import ActivityTags from './activity-tags';
import { isDefined } from 'utils/is-defined';

interface IProps {
  duration?: string;
  createdDateTime?: string;
  tags: string[];
  description?: string;
}

const ActivityVisibilityDuration: React.FC<IProps> = ({
  duration,
  createdDateTime,
  tags,
  description
}) => {
  return (
    <>
      <Box
        sx={{
          mt: 2,
          mb: 1,
          px: 1,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4" align="left">
          Duration
        </Typography>

        <Typography variant="subtitle1" align="right" sx={{ fontSize: '16px' }}>
          {duration}
        </Typography>
      </Box>

      <ActivityTags tags={tags} sx={{ mt: 3 }} />
      {isDefined(description) ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              mt: 3,
              mb: 2,
              px: 1
            }}>
            <Typography variant="h4" align="left">
              Additional description
            </Typography>
          </Box>
          <Box sx={{ m: 0.5, wordWrap: 'break-word' }}>
            <Typography>{description}</Typography>
          </Box>
        </>
      ) : null}

      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          fontSize: '12px',
          m: 3,
          color: 'inactive'
        }}>
        Created at {createdDateTime}
      </Typography>
    </>
  );
};

export default ActivityVisibilityDuration;
