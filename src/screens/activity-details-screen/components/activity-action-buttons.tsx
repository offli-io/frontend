import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';

interface IActivityActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isCreator?: boolean;
  onJoinClick?: () => void;
  onManageClick?: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
  hasEnded?: boolean;
  inProgress?: boolean;
  privateUninvitedActivity?: boolean;
}

const ActivityActionButtons: React.FC<IActivityActionButtonsProps> = ({
  isAlreadyParticipant,
  isCreator,
  onJoinClick,
  onManageClick,
  areActionsLoading,
  //TODO just get activity and define all these properties in this component
  isPublic,
  hasEnded,
  inProgress = false,
  privateUninvitedActivity
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        my: 2
      }}>
      {(isPublic || !privateUninvitedActivity) && !hasEnded && !inProgress ? (
        <>
          <OffliButton
            size="small"
            sx={{
              fontSize: 18,
              width: '40%',
              height: 48,
              color: isAlreadyParticipant ? 'primary.main' : 'background.default'
            }}
            onClick={onJoinClick}
            color={!isAlreadyParticipant ? 'primary' : 'secondary'}
            isLoading={areActionsLoading}
            startIcon={
              isAlreadyParticipant ? (
                <CheckCircleIcon sx={{ color: 'primary.main' }} />
              ) : (
                <CheckCircleOutlineIcon sx={{ color: 'background.default' }} />
              )
            }>
            {isAlreadyParticipant ? (isCreator ? 'Dismiss' : 'Joined') : 'Join'}
          </OffliButton>
          <OffliButton
            size="small"
            disabled={areActionsLoading}
            sx={{
              fontSize: 18,
              width: '40%',
              height: 48,
              bgcolor: 'primary.light',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light'
              }
            }}
            onClick={onManageClick}
            startIcon={
              <SettingsIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            }>
            Manage
          </OffliButton>
        </>
      ) : null}
      {hasEnded ? (
        <OffliButton
          color="secondary"
          startIcon={<HistoryIcon sx={{ color: 'primary.main' }} />}
          sx={{ width: '80%', color: 'primary.main', fontWeight: 'bold' }}>
          Activity has finished
        </OffliButton>
      ) : null}

      {inProgress ? (
        <OffliButton
          color="secondary"
          startIcon={
            <FiberManualRecordIcon
              sx={{
                color: 'primary.main',
                '@keyframes blink': {
                  '25%': {
                    opacity: 0.5
                  },
                  '50%': {
                    opacity: 0
                  },
                  '75%': {
                    opacity: 0.5
                  }
                },
                animation: 'blink 1s linear infinite'
              }}
            />
          }
          sx={{
            width: '80%',
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
          Activity is in progress
        </OffliButton>
      ) : null}
    </Box>
  );
};

export default ActivityActionButtons;
