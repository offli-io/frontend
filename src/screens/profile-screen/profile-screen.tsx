import { Box, Typography, useTheme } from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImagePreviewModal from 'components/image-preview-modal/image-preview-modal';
import Loader from 'components/loader';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getBuddyState } from '../../api/users/requests';
import userPlaceholder from '../../assets/img/user-placeholder.svg';
import { AuthenticationContext } from '../../context/providers/authentication-provider';
import OffliButton from '../../components/offli-button';
import { PageWrapper } from '../../components/page-wrapper';
import ProfileStatistics from '../../components/profile-statistics';
import { useGetApiUrl } from '../../hooks/use-get-api-url';
import { useUser } from '../../hooks/use-user';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { BuddyRequestActionEnum } from '../../types/users/buddy-request-action-enum.dto';
import { BuddyStateEnum } from '../../types/users/buddy-state-enum.dto';
import BuddyButton from './components/buddies-button';
import LastAttendedActivities from './components/last-attended-activites';
import ProfileGallery from './components/profile-gallery/profile-gallery';
import { useSendBuddyRequest } from './hooks/use-send-buddy-request';
import { useToggleBuddyRequest } from './hooks/use-toggle-buddy-request';
import { ProfileEntryTypeEnum } from './types/profile-entry-type';
import { generateBuddyActionButtonLabel } from './utils/generate-buddy-action-button-label.util';
import { useUserStats } from '../../hooks/use-user-stats';
import { IUserStatisticsDto } from '../../types/users/user-statistics.dto';
import CreatorFeedback from './components/creator-feedback';

interface IProfileScreenProps {
  type: ProfileEntryTypeEnum;
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = useGetApiUrl();
  const [previewModalImageUrl, setPreviewModalImageUrl] = React.useState<string | null>(null);

  const { handleToggleBuddyRequest, isTogglingBuddyRequest } = useToggleBuddyRequest({
    onSuccess:
      type === ProfileEntryTypeEnum.REQUEST
        ? undefined
        : () => navigate(ApplicationLocations.BUDDIES)
  });
  const { handleSendBuddyRequest } = useSendBuddyRequest({
    onSuccess: () => {
      queryClient.invalidateQueries(['buddy-state']);
      queryClient.invalidateQueries(['recommended-buddies']);
    }
  });

  const { data: { data: { user = {} } = {} } = {}, isLoading } = useUser({
    id: id ? Number(id) : userInfo?.id,
    requestingInfoUserId: id ? userInfo?.id : undefined
  });

  const {
    data: { data: userStats = {} as IUserStatisticsDto } = {}
    // isLoading: isUserStatsLoading
  } = useUserStats(id ? Number(id) : Number(userInfo?.id));

  const isBuddy = React.useMemo(
    () => !!user?.buddies?.find(({ id }) => id === userInfo?.id),
    [user]
  );

  const isOtherProfile = React.useMemo(
    () =>
      isBuddy || [ProfileEntryTypeEnum.REQUEST, ProfileEntryTypeEnum.USER_PROFILE].includes(type),
    [type]
  );

  const {
    data: { data: { state: buddyState = null, sender_id = null, receiver_id = null } = {} } = {},
    isFetching: isBuddyStateLoading
  } = useQuery(
    ['buddy-state', userInfo?.id, id],
    () => getBuddyState(Number(userInfo?.id), Number(id)),
    {
      onError: () => {
        toast.error('Failed to load buddy states');
      },
      enabled:
        [ProfileEntryTypeEnum.REQUEST, ProfileEntryTypeEnum.USER_PROFILE].includes(type) && !!id
    }
  );

  const onBuddyRequestAccept = React.useCallback(() => {
    handleToggleBuddyRequest({
      buddyToBeId: Number(id),
      status: BuddyRequestActionEnum.CONFIRM
    });
  }, [handleToggleBuddyRequest, id]);

  const onBuddyRequestDecline = React.useCallback(() => {
    handleToggleBuddyRequest({
      buddyToBeId: Number(id),
      status: BuddyRequestActionEnum.REJECT
    });
  }, [handleToggleBuddyRequest, id]);

  const handleBuddyRequest = React.useCallback(() => {
    // don't need to check sender id because when I have already sent buddy request button is disabled
    if (buddyState === BuddyStateEnum.PENDING) {
      return onBuddyRequestAccept();
    }

    handleSendBuddyRequest(Number(id));
  }, [buddyState, onBuddyRequestAccept, handleSendBuddyRequest]);

  const actionButtonDisabled = React.useMemo(
    () =>
      // buddy request sent by you
      (buddyState === BuddyStateEnum.PENDING && sender_id === userInfo?.id) ||
      //or declined buddy request
      buddyState === BuddyStateEnum.BLOCKED ||
      buddyState === BuddyStateEnum.CONFIRMED,
    [buddyState, sender_id, userInfo?.id]
  );

  if (isLoading || isBuddyStateLoading) {
    return <Loader />;
  }

  return (
    <>
      <ImagePreviewModal
        imageSrc={`${baseUrl}/files/${previewModalImageUrl}`}
        open={!!previewModalImageUrl}
        onClose={() => setPreviewModalImageUrl(null)}
      />
      <PageWrapper sxOverrides={{ mt: 0 }}>
        <Box
          sx={{
            // height: '20%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 150,
              zIndex: 0,
              position: 'relative',
              boxShadow: shadows[2]
            }}>
            <img
              src={user?.title_photo ? `${baseUrl}/files/${user?.title_photo}` : userPlaceholder}
              alt="title"
              style={{ maxHeight: '100%', width: '100%' }}
              onClick={() => !!user?.title_photo && setPreviewModalImageUrl(user?.title_photo)}
            />
            {type === ProfileEntryTypeEnum.PROFILE && (
              <BuddyButton buddyCount={user?.buddies_count} />
            )}
          </Box>
          <Box
            sx={{
              zIndex: 1,
              display: 'flex',
              mt: -5.5,
              flexDirection: 'column'
            }}>
            <Box sx={{ display: 'flex' }}>
              <img
                src={
                  user?.profile_photo ? `${baseUrl}/files/${user?.profile_photo}` : userPlaceholder
                }
                alt="profile"
                style={{
                  height: 100,
                  aspectRatio: 1,
                  borderRadius: '50%',
                  backgroundColor: palette?.background?.default,
                  border: `1px solid ${palette?.primary?.main}`
                }}
                data-testid="profile-img"
                onClick={() =>
                  !!user?.profile_photo && setPreviewModalImageUrl(user?.profile_photo)
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'baseline',
                    height: '50%',
                    mt: 6
                  }}>
                  <Typography
                    variant="h2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 250
                    }}>
                    {user?.username}
                  </Typography>
                  {!!user?.location && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: 250
                      }}>
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                        {user?.location?.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: 'center',
                mt: 2,
                boxSizing: 'border-box',
                px: 2
              }}>
              {user?.about_me}
            </Typography>
          </Box>
        </Box>
        {type === ProfileEntryTypeEnum.PROFILE && (
          <OffliButton
            sx={{
              mt: 2,
              width: '60%',
              fontSize: 18,
              bgcolor: 'primary.light',
              color: 'primary.main'
            }}
            onClick={() => navigate(ApplicationLocations.EDIT_PROFILE)}>
            Edit profile
          </OffliButton>
        )}
        {[ProfileEntryTypeEnum.REQUEST, ProfileEntryTypeEnum.USER_PROFILE].includes(type) &&
        !isBuddy ? (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              mt: 2.5
            }}>
            <OffliButton
              color={buddyState === BuddyStateEnum.BLOCKED ? 'error' : 'primary'}
              sx={{ fontSize: 14, width: '45%', mr: 2 }}
              onClick={handleBuddyRequest}
              isLoading={isTogglingBuddyRequest}
              disabled={actionButtonDisabled}>
              {generateBuddyActionButtonLabel(buddyState, userInfo?.id, sender_id)}
            </OffliButton>
            {receiver_id === userInfo?.id && buddyState === BuddyStateEnum.PENDING ? (
              <OffliButton
                sx={{ fontSize: 14, px: 3 }}
                variant="outlined"
                onClick={onBuddyRequestDecline}
                isLoading={isTogglingBuddyRequest}>
                Decline
              </OffliButton>
            ) : null}
          </Box>
        ) : null}
        <LastAttendedActivities isBuddy={isBuddy} />
        <CreatorFeedback
          creator_feedback={userStats?.creator_feedback}
          // activities_created_last_month_count={userStats?.activities_created_last_month_count}
          username={user?.username}
        />

        <Box
          sx={{
            width: '90%',
            mb: 3
          }}>
          <Typography align="left" variant="h5" sx={{ mt: 3, color: palette?.text?.primary }}>
            This month
          </Typography>
          <ProfileStatistics
            participatedNum={userStats?.activities_participated_last_month_count}
            createdNum={
              isBuddy || [ProfileEntryTypeEnum.PROFILE].includes(type)
                ? userStats?.activities_created_last_month_count
                : undefined
            }
            metNum={
              isBuddy || [ProfileEntryTypeEnum.PROFILE].includes(type)
                ? userStats?.new_buddies_last_month_count
                : undefined
            }
            user={user}
            isLoading={isLoading}
          />
        </Box>

        {isOtherProfile && !user?.instagram ? null : (
          <ProfileGallery
            isOtherProfile={isOtherProfile}
            photoUrls={user?.instagram_photos}
            instagramUsername={user?.instagram}
          />
        )}
      </PageWrapper>
    </>
  );
};

export default ProfileScreen;
