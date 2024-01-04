import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PageviewIcon from '@mui/icons-material/Pageview';
import { Box } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IActivity } from 'types/activities/activity.dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';

interface IActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isCreator?: boolean;
  onJoinClick?: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
  activity?: IActivity;
}

const ActionButtons: React.FC<IActionButtonsProps> = ({
  isAlreadyParticipant,
  isCreator,
  onJoinClick,
  areActionsLoading,
  isPublic,
  activity
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        my: 2
      }}>
      {isPublic ? (
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
              color: 'primary.main'
            }}
            onClick={() => {
              navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`, {
                state: { id: activity?.id }
              });
            }}
            startIcon={
              <PageviewIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            }>
            View
          </OffliButton>
        </>
      ) : null}
    </Box>
  );
};

export default ActionButtons;
