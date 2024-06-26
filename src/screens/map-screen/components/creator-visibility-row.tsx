import { mdiCrown } from '@mdi/js';
import Icon from '@mdi/react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import { useActivities } from 'hooks/activities/use-activities';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IActivityRestDto } from 'types/activities/activity-rest.dto';
import { ActivityVisibilityEnum } from 'types/activities/activity-visibility-enum.dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import userPlaceholder from '../../../assets/img/user-placeholder.svg';
import { useGetApiUrl } from '../../../hooks/utils/use-get-api-url';
import { IPerson } from '../../../types/activities/activity.dto';

interface IProps {
  creator?: IPerson;
  activityId?: number;
}

export const CreatorVisibilityRow: React.FC<IProps> = ({ activityId }) => {
  const baseUrl = useGetApiUrl();
  const { palette } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();

  const { data: { data: { activity = undefined } = {} } = {} } = useActivities<IActivityRestDto>({
    params: {
      id: activityId ? Number(activityId) : undefined,
      participantId: userInfo?.id
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        my: 1
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          maxWidth: '70%'
        }}
        onClick={() => {
          if (activity?.creator?.id !== userInfo?.id) {
            navigate(`${ApplicationLocations.USER_PROFILE}/${activity?.creator?.id}`);
          }
        }}>
        <Box sx={{ position: 'relative' }}>
          <img
            src={
              activity?.creator?.profile_photo
                ? `${baseUrl}/files/${activity?.creator?.profile_photo}`
                : userPlaceholder
            }
            alt="profile"
            style={{
              height: 40,
              width: 40,
              aspectRatio: 1,
              borderRadius: '50%',
              borderWidth: '2px',
              borderColor: palette?.primary?.main,
              borderStyle: 'solid',
              margin: 1
            }}
          />
          <Icon
            path={mdiCrown}
            size={0.8}
            style={{
              position: 'absolute',
              left: -4,
              top: -7,
              fontSize: 12,
              color: palette?.primary?.main,
              border: '0.5px solid palette?.background?.default',
              borderRadius: '50%',
              backgroundColor: palette?.background?.default
              // boxShadow: shadows[1],
            }}
          />
        </Box>

        <Typography
          sx={{
            ml: 1,
            fontSize: 16,
            // fontWeight: "bold",
            color: ({ palette }) => palette?.text?.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          {activity?.creator?.username}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {activity?.visibility === ActivityVisibilityEnum.private ? (
          <LockIcon sx={{ fontSize: 20 }} />
        ) : (
          <LockOpenIcon sx={{ fontSize: 20 }} />
        )}
        <Typography
          variant="h6"
          align="left"
          sx={{
            ml: 0.5
          }}>
          {activity?.visibility}
        </Typography>
      </Box>
    </Box>
  );
};
