import FavoriteIcon from '@mui/icons-material/Favorite';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import { Box, Typography } from '@mui/material';
import React from 'react';
import activitiesAttendedPicture from '../assets/img/activities-attended.svg';
import enjoyedTimeTogetherPicture from '../assets/img/enjoyed-time-together.svg';

interface IProps {
  participatedNum?: number;
  enjoyedNum?: number;
  createdNum?: number;
  metNum?: number;
  isLoading?: boolean;
}

const AlternativePicturetatistics: React.FC<IProps> = ({ participatedNum, enjoyedNum }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {participatedNum && participatedNum > 0 ? (
        // {TODO Outsource this image statistic into separate component}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: 100,
            mt: 2
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img alt="activities_attended" src={activitiesAttendedPicture} style={{ height: 65 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex' }}>
              <OfflineBoltIcon sx={{ color: 'primary.main' }} />
              <Typography
                sx={{
                  fontWeight: 'bold',
                  ml: 1,
                  color: ({ palette }) => palette?.primary?.main
                }}>
                {participatedNum}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: ({ palette }) => palette?.primary?.main
              }}>
              activities attended
            </Typography>
          </Box>
        </Box>
      ) : null}
      {enjoyedNum && enjoyedNum > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: 100,
            mt: 2
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              alt="activities_attended"
              src={enjoyedTimeTogetherPicture}
              style={{ height: 65 }}
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex' }}>
              <FavoriteIcon sx={{ color: 'primary.main' }} />
              <Typography
                sx={{
                  fontWeight: 'bold',
                  ml: 1,
                  color: ({ palette }) => palette?.primary?.main
                }}>
                {enjoyedNum}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: ({ palette }) => palette?.primary?.main
              }}>
              activities enjoyed
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default AlternativePicturetatistics;
