import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Box } from '@mui/material';
import { AuthenticationContext } from 'assets/theme/authentication-provider';
import OffliButton from 'components/offli-button';
import React, { useState } from 'react';

interface IInviteActionButtonsProps {
  areActionsLoading?: boolean;
  activityTitle?: string;
  activityPhoto?: string;
}

const InviteActionButtons: React.FC<IInviteActionButtonsProps> = ({
  areActionsLoading,
  activityTitle,
  activityPhoto
}) => {
  const [toggleCopyButton, setToggleCopyButton] = useState(false);

  const handleCopyLink = () => {
    const linkToCopy = window.location.href;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => setToggleCopyButton(!toggleCopyButton))
      .catch((error) => console.error('Unable to copy text: ', error));
  };

  const { userInfo } = React.useContext(AuthenticationContext);

  const handleShareActivity = async () => {
    try {
      if (activityPhoto) {
        const response = await fetch(activityPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'rick.jpg', { type: blob.type });

        await navigator.share({
          url: window.location.href,
          title: activityTitle ?? 'Activity title',
          text: `${userInfo?.username} wants to show you activity ${activityTitle}`,
          files: [file]
        });
      } else {
        console.error('Activity photo is undefined.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        my: 1
      }}>
      <OffliButton
        size="small"
        sx={{
          fontSize: 18,
          width: '40%',
          height: 48,
          color: 'primary.main'
        }}
        onClick={handleShareActivity}
        color="secondary"
        variant="text"
        isLoading={areActionsLoading}
        startIcon={<IosShareIcon sx={{ color: 'primary.main' }} />}>
        Share to
      </OffliButton>
      <OffliButton
        size="small"
        sx={{
          fontSize: 18,
          width: '40%',
          height: 48,
          color: 'primary.main'
        }}
        color="secondary"
        variant="text"
        onClick={handleCopyLink}
        isLoading={areActionsLoading}
        startIcon={
          !toggleCopyButton ? (
            <ContentCopyIcon sx={{ color: 'primary.main' }} />
          ) : (
            <DoneIcon sx={{ color: 'primary.main' }} />
          )
        }>
        {!toggleCopyButton ? 'Copy link' : 'Copied!'}
      </OffliButton>
    </Box>
  );
};

export default InviteActionButtons;
