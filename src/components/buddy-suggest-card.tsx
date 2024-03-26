import { Box, styled, Typography } from '@mui/material';
import React from 'react';
import personPlaceholderImage from '../assets/img/user-placeholder.svg';
import { useGetApiUrl } from '../hooks/use-get-api-url';
import { IPerson } from '../types/activities/activity.dto';
import OffliButton from './offli-button';

interface ILabeledDividerProps {
  buddy: IPerson;
  children?: React.ReactElement;
  onAddBuddyClick?: (e: React.MouseEvent<HTMLButtonElement>, buddy: IPerson) => void;
  onClick?: (buddy: IPerson) => void;
  isLoading?: boolean;
}

const StyledImage = styled((props: any) => <img {...props} alt="Buddy item" />)`
  height: 80px;
  width: 80px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`;

const BuddySuggestCard: React.FC<ILabeledDividerProps> = ({
  buddy,
  onAddBuddyClick,
  onClick,
  isLoading
}) => {
  const baseUrl = useGetApiUrl();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
        p: 1.5,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 110,
        overflow: 'hidden',
        mx: 1
      }}
      onClick={() => onClick?.(buddy)}>
      <StyledImage
        src={
          buddy?.profile_photo ? `${baseUrl}/files/${buddy?.profile_photo}` : personPlaceholderImage
        }
        alt="profile picture"
      />
      <Typography
        sx={{
          fontSize: 14,
          m: 1,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}>
        {buddy?.username}
      </Typography>
      <OffliButton
        onClick={(e) => onAddBuddyClick?.(e, buddy)}
        sx={{ fontSize: 14 }}
        isLoading={isLoading}>
        Add buddy
      </OffliButton>
    </Box>
  );
};
export default BuddySuggestCard;
