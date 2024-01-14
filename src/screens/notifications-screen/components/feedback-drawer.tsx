import { Box, Rating, ThemeProvider, Typography, createTheme, useTheme } from '@mui/material';
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
import { DATE_TIME_FORMAT } from '../../../utils/common-constants';
import firstTimeLoginUrl from '../../../assets/img/first-time-login.svg';

const theme = createTheme({
  components: {
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: 'primary'
        }
      }
    }
  }
});

export interface IFeedbackDrawerProps {
  activity?: IActivity;
}

const FeedbackDrawer: React.FC<IFeedbackDrawerProps> = ({ activity }) => {
  const baseUrl = useGetApiUrl();
  const queryClient = useQueryClient();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { shadows } = useTheme();

  const [step, setStep] = React.useState(0);
  const [feedbackValue, setFeedbackValue] = React.useState<number | null>(0);

  const { mutate: sendFeedbackOnCreator } = useMutation(
    ['user-feedback'],
    (values: ICreatorFeedback) => sendUserFeedback(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        setStep(1);
        toggleDrawer({
          open: false
        });
        // toast.success('Feedback has been sent');
      },
      onError: () => {
        toast.error('Failed to send feedback');
        // TODO: dat dopice, len na test
        setStep(1);
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
              aspectRatio: 1,
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
                objectFit: 'contain',
                zIndex: 10
              }}
            />
            <img
              src={`${baseUrl}/files/${activity?.title_picture}`}
              alt="activity_title_picture"
              style={{
                height: 190,
                aspectRatio: 1,
                borderRadius: '10px',
                margin: 5,
                objectFit: 'contain',
                boxShadow: shadows[4]
              }}
            />
          </div>
          <Typography
            variant="h1"
            align="center"
            sx={{ mb: 1, color: ({ palette }) => palette.primary.main }}>
            {activity?.title}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontSize: 12, mb: 2, color: ({ palette }) => palette.primary.main }}>
            {activity?.datetime_from && format(new Date(activity?.datetime_from), DATE_TIME_FORMAT)}
          </Typography>
          <ThemeProvider theme={theme}>
            <Rating
              name="feedback"
              defaultValue={2}
              size="large"
              value={feedbackValue}
              onChange={(event, newValue) => {
                setFeedbackValue(newValue);
              }}
            />
          </ThemeProvider>
          <OffliButton
            sx={{ width: '70%', mt: 4 }}
            onClick={() =>
              sendFeedbackOnCreator({
                activity_id: activity?.id,
                user_id: activity?.creator?.id,
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
            alt="Activity leave"
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
