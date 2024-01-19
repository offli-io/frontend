import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';

interface IActivityActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isAbleToSendFeedback?: boolean;
  sentFeedbackValue?: number;
  isCreator?: boolean;
  onJoinClick?: () => void;
  onMoreClick?: () => void;
  onActivityFinishedClick: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
  hasEnded?: boolean;
  inProgress?: boolean;
  privateUninvitedActivity?: boolean;
}

const ActivityActionButtons: React.FC<IActivityActionButtonsProps> = ({
  isAlreadyParticipant,
  isAbleToSendFeedback,
  sentFeedbackValue,
  isCreator,
  onJoinClick,
  onMoreClick,
  onActivityFinishedClick,
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
            onClick={onMoreClick}
            startIcon={
              <MenuIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            }>
            More
          </OffliButton>
        </>
      ) : null}
      {hasEnded ? (
        <OffliButton
          color="secondary"
          onClick={isAbleToSendFeedback ? () => onActivityFinishedClick() : () => {}}
          startIcon={<HistoryIcon sx={{ color: 'primary.main', marginLeft: '-2.2rem' }} />}
          sx={{
            width: '80%',
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '1rem',
              lineHeight: 1.5
            }}>
            Activity has finished
            {isAbleToSendFeedback && (
              <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                Tap to send a feedback
              </Typography>
            )}
            {sentFeedbackValue && (
              <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                Your feedback: {sentFeedbackValue}/5
              </Typography>
            )}
          </div>
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
