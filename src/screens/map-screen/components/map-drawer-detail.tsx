import { CircularProgress, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { changeActivityParticipantStatus, removePersonFromActivity } from 'api/activities/requests';
import { format } from 'date-fns';
import { sk } from 'date-fns/esm/locale';
import { useInvalidateQueryKeys } from 'hooks/utils/use-invalidate-query-keys';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ActivityInviteStateEnum } from 'types/activities/activity-invite-state-enum.dto';
import { ActivityVisibilityEnum } from 'types/activities/activity-visibility-enum.dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import { useActivities } from '../../../hooks/activities/use-activities';
import { useGetApiUrl } from '../../../hooks/utils/use-get-api-url';
import { ActivitiyParticipantStatusEnum as ActivityParticipantStatusEnum } from '../../../types/activities/activity-participant-status-enum.dto';
import { IActivityRestDto } from '../../../types/activities/activity-rest.dto';
import { calculateDistance } from '../../../utils/calculate-distance.util';
import { DATE_TIME_FORMAT } from '../../../utils/common-constants';
import { getTimeDifference } from '../utils/get-time-difference';
import ActionButtons from './action-buttons';
import ActivityDetailTiles from './activity-detail-tiles';
import AdditionalDescription from './additional-description';
import CreatedTimestamp from './created-timestamp';
import { CreatorVisibilityRow } from './creator-visibility-row';

interface IProps {
  activityId?: number;
  userLocation?: GeolocationCoordinates;
}

const MainBox = styled(Box)(() => ({
  width: '100%',
  position: 'relative',
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  visibility: 'visible',
  right: 0,
  left: 0,
  height: 450
}));

const MapDrawerDetail: React.FC<IProps> = ({ activityId, userLocation }) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      params: {
        id: activityId
      }
    });
  const { activityCreatedOrEditedInvalidation } = useInvalidateQueryKeys();

  const baseUrl = useGetApiUrl();
  const navigate = useNavigate();

  const participantsNum =
    activity?.limit !== undefined && activity?.count_confirmed !== undefined
      ? `${String(activity?.limit - activity?.count_confirmed)} spots remaining`
      : 'Unlimited attendace';

  const dateTimeFrom = activity?.datetime_from ? new Date(activity?.datetime_from) : null;
  const dateTimeUntil = activity?.datetime_until ? new Date(activity?.datetime_until) : null;
  const dateTimeCreatedAt = activity?.created_at ? new Date(activity?.created_at) : null;

  const timeDifference = getTimeDifference(dateTimeFrom, dateTimeUntil); // useMemo??
  const durationMinutes = timeDifference?.durationMinutes;
  const durationHours = timeDifference?.durationHours;

  const { mutate: sendLeaveActivity, isLoading: isLeavingActivity } = useMutation(
    ['leave-activity'],
    (activityId?: number) => removePersonFromActivity({ activityId, personId: userInfo?.id }),
    {
      onSuccess: (data, activityId) => {
        activityCreatedOrEditedInvalidation(activityId);
        toast.success('You have successfully left the activity');
      },
      onError: () => {
        toast.error('Failed to leave activity');
      }
    }
  );

  const { mutate: sendJoinActivity, isLoading: isJoiningActivity } = useMutation(
    ['join-activity'],
    () =>
      changeActivityParticipantStatus(Number(activityId), Number(userInfo?.id), {
        status: ActivityInviteStateEnum.CONFIRMED
      }),
    {
      onSuccess: () => {
        toast.success('You have successfully joined the activity');
        activityCreatedOrEditedInvalidation(activityId);
        navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`);
      },
      onError: () => {
        toast.error('Failed to join activity');
      }
    }
  );

  const areActionsLoading = isLeavingActivity || isJoiningActivity;
  const isCreator = activity?.creator?.id === userInfo?.id;

  const isAlreadyParticipant = React.useMemo(
    () => !!activity && activity?.participant_status === ActivityParticipantStatusEnum.CONFIRMED,

    [activity]
  );

  const handleJoinButtonClick = React.useCallback(() => {
    isAlreadyParticipant ? sendLeaveActivity(Number(activityId)) : sendJoinActivity();
  }, [isAlreadyParticipant, isCreator, activityId]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            width: '100%',
            my: 4,
            display: 'flex',
            justifyContent: 'center'
          }}>
          <CircularProgress />
        </Box>
      ) : (
        <MainBox>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
              wordWrap: 'break-word',
              overflow: 'hidden'
            }}>
            <Box
              sx={{
                my: 1
              }}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  mb: 0.5
                }}>
                {activity?.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  mx: 2
                }}>
                {activity?.location?.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center'
                }}>
                {dateTimeFrom ? format(dateTimeFrom, DATE_TIME_FORMAT, { locale: sk }) : '-'}
              </Typography>
            </Box>
            <ActivityDetailTiles
              participantsNum={participantsNum}
              durationHours={`${durationHours === 1 ? '1 hour' : String(durationHours) + ' hours'}`}
              durationMinutes={`${
                durationMinutes === 1 ? '1 minute' : String(durationMinutes) + ' minutes'
              }`}
              distance={calculateDistance(activity?.location?.coordinates, {
                lat: userLocation?.latitude,
                lon: userLocation?.longitude
              })}
              price={activity?.price}
            />

            <ActionButtons
              onJoinClick={handleJoinButtonClick}
              areActionsLoading={areActionsLoading}
              isCreator={isCreator}
              isAlreadyParticipant={isAlreadyParticipant}
              isPublic={activity?.visibility === ActivityVisibilityEnum.public}
              activity={activity}
            />

            <img
              src={
                activity?.title_picture
                  ? `${baseUrl}/files/${activity?.title_picture}`
                  : //TODO add activity placeholder
                    ''
              }
              alt="activity_title_photo"
              style={{
                width: '100%'
              }}
            />
            {activity?.creator ? (
              <CreatorVisibilityRow creator={activity?.creator} activityId={activityId} />
            ) : null}
            {activity?.description ? (
              <AdditionalDescription description={activity?.description} />
            ) : null}

            <CreatedTimestamp
              timestamp={
                dateTimeCreatedAt
                  ? `${format(dateTimeCreatedAt, DATE_TIME_FORMAT, {
                      locale: sk
                    })}`
                  : '-'
              }
            />
          </Box>
        </MainBox>
      )}
    </>
  );
};

export default MapDrawerDetail;
