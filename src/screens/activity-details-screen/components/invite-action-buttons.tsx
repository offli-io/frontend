import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Box } from '@mui/material';
import OffliButton from 'components/offli-button';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import React, { useState } from 'react';

interface IInviteActionButtonsProps {
  areActionsLoading?: boolean;
  activityTitle?: string;
}

const InviteActionButtons: React.FC<IInviteActionButtonsProps> = ({
  areActionsLoading,
  activityTitle
}) => {
  const [toggleCopyButton, setToggleCopyButton] = useState(false);
  const { userInfo } = React.useContext(AuthenticationContext);

  const handleCopyLink = () => {
    const linkToCopy = window.location.href;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => setToggleCopyButton(!toggleCopyButton))
      .catch((error) => console.error('Unable to copy text: ', error));
  };

  const handleShareActivity = async () => {
    try {
      const shareData = {
        title: activityTitle ?? 'Offli',
        text: `${userInfo?.username} wants to show you activity ${activityTitle}`,
        url: window.location.href
      };

      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing activity:', error);
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
