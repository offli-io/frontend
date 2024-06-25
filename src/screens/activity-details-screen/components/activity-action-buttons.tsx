import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography } from '@mui/material';
import OffliButton from 'components/offli-button';
import { isWithinInterval } from 'date-fns';
import React from 'react';
import { useParams } from 'react-router-dom';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import OffliRating from '../../../components/offli-rating';
import { useActivity } from '../../../hooks/use-activity';
import { ActivityVisibilityEnum } from '../../../types/activities/activity-visibility-enum.dto';

interface IActivityActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isAllowedToSendFeedback?: boolean;
  sentFeedbackValue?: number;
  onJoinClick?: () => void;
  onMoreClick?: () => void;
  onToggleFeedbackDrawer: () => void;
  areActionsLoading?: boolean;
  hasEnded?: boolean;
}

const ActivityActionButtons: React.FC<IActivityActionButtonsProps> = ({
  isAlreadyParticipant,
  isAllowedToSendFeedback,
  sentFeedbackValue,
  onJoinClick,
  onMoreClick,
  onToggleFeedbackDrawer,
  areActionsLoading,
  //TODO just get activity and define all these properties in this component
  hasEnded
}) => {
  const { id } = useParams();
  const { userInfo } = React.useContext(AuthenticationContext);

  const { data: { data: { activity = {} } = {} } = {} } = useActivity({
    id: Number(id)
  });

  const inProgress =
    !!activity?.datetime_from &&
    !!activity?.datetime_until &&
    isWithinInterval(new Date(), {
      start: new Date(activity?.datetime_from),
      end: new Date(activity?.datetime_until)
    });

  const privateUninvitedActivity =
    activity?.visibility === ActivityVisibilityEnum.private && !activity?.participant_status;

  const isPublic = activity?.visibility === ActivityVisibilityEnum.public;
  const isCreator = activity?.creator?.id === userInfo?.id;
  const isFull = activity?.count_confirmed === activity?.limit;
  const cantJoinBecauseOfCapacity = !isAlreadyParticipant && isFull;

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
            disabled={cantJoinBecauseOfCapacity}
            data-testid="activity-action-button-primary"
            startIcon={
              isAlreadyParticipant ? (
                <CheckCircleIcon
                  sx={{ color: cantJoinBecauseOfCapacity ? 'inherit' : 'primary.main' }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{ color: cantJoinBecauseOfCapacity ? 'inherit' : 'background.default' }}
                />
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
            bgcolor: 'primary.light',
            fontWeight: 'bold'
          }}>
          Activity is in progress
        </OffliButton>
      ) : null}
    </Box>
  );
};

export default ActivityActionButtons;
