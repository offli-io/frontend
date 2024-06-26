import { Box, SxProps, Typography, useTheme } from '@mui/material';
import React from 'react';
import userPlaceholder from '../assets/img/user-placeholder.svg';
import { useGetApiUrl } from '../hooks/utils/use-get-api-url';
import { IPerson } from '../types/activities/activity.dto';

interface IBuddyItemProps {
  buddy: IPerson;
  children?: React.ReactElement;
  actionContent?: React.ReactNode;
  onClick?: (buddy?: IPerson) => void;
  sx?: SxProps;
  divRef?: any;
}

const BuddyItem: React.FC<IBuddyItemProps> = ({
  buddy,
  actionContent,
  onClick,
  sx,
  divRef,
  ...rest
}) => {
  const { shadows } = useTheme();
  const baseUrl = useGetApiUrl();

  return (
    <Box
      onClick={() => onClick?.(buddy)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        textTransform: 'none',
        width: '100%',
        ...sx
      }}
      ref={divRef}
      {...rest}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mx: 1,
          maxWidth: '85%',
          overflow: 'hidden'
        }}>
        <img
          src={buddy?.profile_photo ? `${baseUrl}/files/${buddy?.profile_photo}` : userPlaceholder}
          alt="profile"
          style={{
            height: 40,
            width: 40,
            borderRadius: '50%',
            boxShadow: shadows?.[2],
            margin: 1
          }}
        />
        <Typography
          sx={{
            ml: 2,
            maxWidth: '100%', // Add this line
            overflow: 'hidden', // Add this line
            textOverflow: 'ellipsis', // Add this line
            whiteSpace: 'nowrap' // Add this line
          }}>
          {buddy?.username}
        </Typography>
      </Box>
      {actionContent}
    </Box>
  );
};
export default BuddyItem;
