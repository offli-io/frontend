import { Box, Rating, Typography, useTheme } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';
import { IActivity } from 'types/activities/activity.dto';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ICreatorFeedback } from '../../../types/users/user-feedback.dto';
import { sendUserFeedback } from '../../../api/users/requests';
import { toast } from 'sonner';
import { DrawerContext } from '../../../context/providers/drawer-provider';
import { format } from 'date-fns';
import { ACTIVITY_ASPECT_RATIO, DATE_TIME_FORMAT } from '../../../utils/common-constants';
import firstTimeLoginUrl from '../../../assets/img/first-time-login.svg';
import { AuthenticationContext } from '../../../context/providers/authentication-provider';
import { FEEDBACK_ALREADY_SENT_BY_USER_QUERY_KEY } from '../../../hooks/use-feedback-already-sent-by-user';
import { USER_STATS_QUERY_KEY } from '../../../hooks/use-user-stats';

export interface IFeedbackDrawerProps {
  activity?: IActivity;
}

const FeedbackDrawer: React.FC<IFeedbackDrawerProps> = ({ activity }) => {
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { shadows, palette } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);

  const [step, setStep] = React.useState(0);
  const [feedbackValue, setFeedbackValue] = React.useState<number | null>(0);

  const { mutate: sendFeedbackOnCreator } = useMutation(
    ['user-feedback'],
    (values: ICreatorFeedback) => sendUserFeedback(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          FEEDBACK_ALREADY_SENT_BY_USER_QUERY_KEY,
          userInfo?.id,
          activity?.id
        ]);
        queryClient.invalidateQueries([USER_STATS_QUERY_KEY, activity?.creator?.id]);
        setStep(1);
      },
      onError: () => {
        toast.error('Failed to send feedback');
      }
    }
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
      {step === 0 && (
        <>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            {`How would you rate ${activity?.creator?.username} as a creator of the activity?`}
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: '-1rem',
              margin: 5
            }}>
            <img
              src={`${baseUrl}/files/${activity?.creator?.profile_photo}`}
              alt="activity_title_picture"
              style={{
                height: 50,
                aspectRatio: 1,
                borderRadius: '50%',
                marginRight: '-25px',
                objectFit: 'cover',
                zIndex: 10,
                boxShadow: shadows[4],
                border: `1.5px solid ${palette?.primary?.main}`
              }}
            />
            <img
              src={`${baseUrl}/files/${activity?.title_picture}`}
              alt="activity_title_picture"
              style={{
                height: 190,
                aspectRatio: ACTIVITY_ASPECT_RATIO,
                borderRadius: '10px',
                margin: 5,
                objectFit: 'cover',
                boxShadow: shadows[4]
              }}
            />
          </div>
          <Typography
            variant="h1"
            align="center"
            sx={{ my: 1, color: ({ palette }) => palette.primary.main }}>
            {activity?.title}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontSize: 12, mb: 2, color: ({ palette }) => palette.primary.main }}>
            {activity?.datetime_from && format(new Date(activity?.datetime_from), DATE_TIME_FORMAT)}
          </Typography>
          <Rating
            name="feedback"
            defaultValue={2}
            size="large"
            value={feedbackValue}
            onChange={(event, newValue) => {
              setFeedbackValue(newValue);
            }}
          />
          <OffliButton
            sx={{ width: '70%', mt: 4 }}
            disabled={!feedbackValue}
            onClick={() =>
              sendFeedbackOnCreator({
                activity_id: activity?.id,
                user_id: userInfo?.id,
                feedback_value: feedbackValue
              })
            }>
            Leave Feedback
          </OffliButton>
        </>
      )}
      {step === 1 && (
        <>
          <Typography variant="h2" align="center" sx={{ mt: 3, mb: 3 }}>
            Thanks for the feedback!
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 8, maxWidth: '70%' }}>
            We will let the creator of the activity know, how much you enjoyed time spent together.
          </Typography>
          <img
            style={{
              height: 160
            }}
            src={firstTimeLoginUrl}
            alt="Activity love"
          />
          <OffliButton
            sx={{ width: '70%', mt: 12 }}
            onClick={() => {
              toggleDrawer({
                open: false
              });
              setStep(0);
            }}>
            Okay
          </OffliButton>
        </>
      )}
    </Box>
  );
};

export default FeedbackDrawer;
