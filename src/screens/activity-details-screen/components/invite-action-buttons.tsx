import { Box } from '@mui/material';
import OffliButton from 'components/offli-button';
import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import IosShareIcon from '@mui/icons-material/IosShare';

interface IInviteActionButtonsProps {
  areActionsLoading?: boolean;
}

const InviteActionButtons: React.FC<IInviteActionButtonsProps> = ({ areActionsLoading }) => {
  const [toggleCopyButton, setToggleCopyButton] = useState(false);

  const handleCopyLink = () => {
    const linkToCopy = window.location.href;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => setToggleCopyButton(!toggleCopyButton))
      .catch((error) => console.error('Unable to copy text: ', error));
  };

  const data = {
    title: 'title',
    text: 'text',
    url: window.location.href
  };

  const handleShareActivity = () => {
    navigator.share(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        my: 2
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
