import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography } from '@mui/material';
import OffliButton from 'components/offli-button';
import OffliRating from '../../../components/offli-rating';

interface IActivityActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isAllowedToSendFeedback?: boolean;
  sentFeedbackValue?: number;
  isCreator?: boolean;
  onJoinClick?: () => void;
  onMoreClick?: () => void;
  onToggleFeedbackDrawer: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
  hasEnded?: boolean;
  inProgress?: boolean;
  privateUninvitedActivity?: boolean;
}

const ActivityActionButtons: React.FC<IActivityActionButtonsProps> = ({
  isAlreadyParticipant,
  isAllowedToSendFeedback,
  sentFeedbackValue,
  isCreator,
  onJoinClick,
  onMoreClick,
  onToggleFeedbackDrawer,
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
        isCreator ? (
          <OffliButton
            size="small"
            sx={{
              fontSize: 18,
              width: '70%',
              height: 48,
              color: 'background.default'
            }}
            disabled={true}>
            Activity ended
          </OffliButton>
        ) : isAllowedToSendFeedback ? (
          <>
            <OffliButton
              size="small"
              sx={{
                fontSize: 18,
                width: '40%',
                height: 48,
                color: 'background.default'
              }}
              disabled={true}>
              Activity ended
            </OffliButton>
            <OffliButton
              size="small"
              disabled={areActionsLoading}
              sx={{
                fontSize: 18,
                width: '50%',
                height: 48,
                bgcolor: 'primary.light',
                color: 'primary.main'
              }}
              onClick={onToggleFeedbackDrawer}>
              Leave feedback
            </OffliButton>
          </>
        ) : sentFeedbackValue ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
              Activity ended, your rating:
            </Typography>
            <OffliRating ratingValue={sentFeedbackValue} />
          </Box>
        ) : null
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
