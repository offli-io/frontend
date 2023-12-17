import { Box, Typography } from '@mui/material';
import React from 'react';
import firstTimeLoginUrl from '../../../assets/img/first-time-login.svg';
import { AuthenticationContext } from '../../../assets/theme/authentication-provider';

export interface IActivityActionsProps {
  onLeaveConfirm?: (activityId?: number) => void;
  onLeaveCancel?: (activityId?: number) => void;
  activityId?: number;
}

const FirstTimeLoginContent: React.FC<IActivityActionsProps> = () => {
  //TODO if no activity display nothing
  const { userInfo } = React.useContext(AuthenticationContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h2" color="primary">
            Welcome
          </Typography>
          <Typography variant="h2">{userInfo?.username}</Typography>
        </Box>
        <img
          style={{
            height: 100
          }}
          src={firstTimeLoginUrl}
          alt="Activity leave"
        />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 'bolder', textAlign: 'center' }}>Thank you,</Typography>
        <Typography sx={{ textAlign: 'center' }}>your registration was successful.</Typography>
      </Box>
      <Box sx={{ ml: 2, mt: 2 }}>
        <Typography sx={{ fontWeight: 'bolder' }}>Now you can</Typography>
        <ul style={{ marginTop: 8 }}>
          <li style={{ lineHeight: 2 }}>Create & search for activities</li>
          <li style={{ lineHeight: 2 }}>Join the forming groups</li>
          <li style={{ lineHeight: 2 }}>See your scheduled activites</li>
          <li style={{ lineHeight: 2 }}>Have balance in you life</li>
          <li style={{ lineHeight: 2 }}>
            Leave feedback on how were the activites and create safe community
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default FirstTimeLoginContent;
