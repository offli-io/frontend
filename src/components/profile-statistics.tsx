import AddRoundedIcon from '@mui/icons-material/AddRounded';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import { useUser } from 'hooks/use-user';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IPerson } from 'types/activities/activity.dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import OffliButton from './offli-button';

interface IProps {
  participatedNum?: number;
  createdNum?: number;
  metNum?: number;
  user?: IPerson;
  isLoading?: boolean;
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  createdNum,
  metNum,
  isLoading
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data: { user = {} } = {} } = {} } = useUser({
    id: id ? Number(id) : userInfo?.id,
    requestingInfoUserId: id ? userInfo?.id : undefined
  });

  //this was used before when we used picture statistics on other profile
  // <AlternativePicturetatistics
  //   participatedNum={participatedNum}
  //   enjoyedNum={enjoyedNum}
  // />
  return (
    <Box
      sx={{
        width: '100%',
        mt: 2
      }}>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: 2
          }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: metNum ? 1 : 2
            }}
            data-testid="participated-statistics">
            <IconButton>
              <OfflineBoltIcon sx={{ fontSize: 30, color: 'inactiveFont.main' }} />
            </IconButton>
            {participatedNum ? (
              <Typography variant="subtitle2" sx={{ ml: 2 }}>
                {id ? `${user?.username} participated` : 'You participated'} in{' '}
                <b>
                  {participatedNum} {participatedNum === 1 ? 'activity' : 'activities'}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}>
                {id ? (
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 2 }}>{`Hasn't joined any activities.`}</Typography>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 2 }}>{`No activities joined?`}</Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0, ml: 2 }}
                      onClick={() => navigate(ApplicationLocations.EXPLORE)}>
                      {`Find exciting options!`}
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: metNum ? 1 : 2
            }}
            data-testid="created-statistics">
            <IconButton>
              <AddRoundedIcon sx={{ fontSize: 30, color: 'inactiveFont.main' }} />
            </IconButton>
            {createdNum ? (
              <Typography variant="subtitle2" sx={{ ml: 2 }}>
                {id ? `${user?.username} created` : 'You created'}{' '}
                <b>
                  {createdNum} {createdNum === 1 ? 'activity' : 'activities'}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}>
                {id ? (
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 2 }}>{`Hasn't organized any activities.`}</Typography>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 2 }}>{`Haven't created any activities`}</Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0, ml: 2 }}
                      onClick={() => navigate(ApplicationLocations.CREATE)}>
                      {`Organize something fun!`}
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: metNum ? 1 : 2
            }}
            data-testid="new-buddies-statistics">
            <IconButton>
              <PeopleAltIcon sx={{ fontSize: 30, color: 'inactiveFont.main', mr: 2 }} />
            </IconButton>
            {metNum ? (
              <Typography variant="subtitle2">
                {id ? `${user?.username} has met` : "You've met"}{' '}
                <b>
                  {metNum} {metNum === 1 ? 'new buddy' : 'new buddies'}
                </b>
                .
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}>
                {id ? (
                  <Typography variant="subtitle2">{`Hasn't made any new buddies.`}</Typography>
                ) : (
                  <Box>
                    <Typography variant="subtitle2">{`No new buddies?`}</Typography>
                    <OffliButton
                      variant="text"
                      sx={{ fontSize: 16, p: 0, m: 0 }}
                      onClick={() => navigate(ApplicationLocations.BUDDIES)}>
                      {`Make new connections!`}
                    </OffliButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileStatistics;
