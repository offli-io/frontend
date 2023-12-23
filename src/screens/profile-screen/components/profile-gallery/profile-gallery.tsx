import InstagramIcon from '@mui/icons-material/Instagram';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unlinkInstagram } from 'api/users/requests';
import { AuthenticationContext } from 'assets/theme/authentication-provider';
import { DrawerContext } from 'assets/theme/drawer-provider';
import ImagePreviewModal from 'components/image-preview-modal/image-preview-modal';
import Loader from 'components/loader';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import React from 'react';
import InstagramDrawerActions from 'screens/profile-screen/components/instagram-drawer-actions';
import { toast } from 'sonner';
import ProfileGalleryImageUploadContent from './components/profile-gallery-image-upload-content';
import ActionButton from 'components/action-button';

interface IProfileGalleryProps {
  photoUrls?: string[];
  isOtherProfile?: boolean;
  instagramUsername?: string | null;
}

const ProfileGallery: React.FC<IProfileGalleryProps> = ({
  photoUrls,
  isOtherProfile,
  instagramUsername
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { shadows, palette } = useTheme();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const [previewModalImageUrl, setPreviewModalImageUrl] = React.useState<string | null>(null);

  const queryParameters = new URLSearchParams(window.location.search);
  const instagramCode = queryParameters.get('code');

  const baseUrl = useGetApiUrl();
  const firstSplittedPhotos: string[] = [];
  const secondSplittedPhotos: string[] = [];

  photoUrls?.forEach((photo, index) => {
    if (index % 2 === 0) {
      firstSplittedPhotos.push(photo);
    } else {
      secondSplittedPhotos.push(photo);
    }
  });

  const handleConnectInstagram = React.useCallback(() => {
    const location = window.location.href.endsWith('/')
      ? window.location.href.slice(0, -1)
      : window.location.href;
    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=574953641463145&redirect_uri=${location}/&scope=user_profile,user_media&response_type=code`;
  }, [window.location.href]);

  const { isLoading: isUnlinkingInstagram, mutate: sendUnlinkInstagram } = useMutation(
    ['instagram-unlink'],
    () => unlinkInstagram(Number(userInfo?.id)),
    {
      onSuccess: () => {
        toast.success('Your instagram account has been successfully unlinked');
        queryClient.invalidateQueries(['user']);
        toggleDrawer({ open: false });
      },
      onError: () => {
        toast.error('Failed unlinking your instagram account');
      }
    }
  );

  React.useEffect(() => {
    if (instagramCode && userInfo?.id) {
      toggleDrawer({
        open: true,
        content: <ProfileGalleryImageUploadContent instagramCode={instagramCode} />
      });
    }
  }, [instagramCode, userInfo?.id]);

  const handleButtonClick = React.useCallback(
    () => (instagramUsername ? sendUnlinkInstagram() : handleConnectInstagram()),
    [instagramUsername, sendUnlinkInstagram, handleConnectInstagram]
  );

  const openInstagramDrawer = React.useCallback(() => {
    if (isOtherProfile) {
      return;
    }
    toggleDrawer({
      open: true,
      content: (
        <InstagramDrawerActions
          instagramUsername={instagramUsername}
          onButtonClick={handleButtonClick}
          onChangePhotosClicked={handleConnectInstagram}
        />
      )
    });
  }, [instagramUsername, isOtherProfile, handleButtonClick, handleConnectInstagram]);

  return (
    <Box sx={{ px: 2, mb: 2, width: '100%', boxSizing: 'border-box' }}>
      <ImagePreviewModal
        imageSrc={
          //TODO better check
          previewModalImageUrl?.includes('https:/')
            ? previewModalImageUrl
            : `${baseUrl}/files/${previewModalImageUrl}`
        }
        open={!!previewModalImageUrl}
        onClose={() => setPreviewModalImageUrl(null)}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: instagramUsername ? 'space-between' : 'flex-start',
          mb: 1
        }}>
        <Box sx={{ mt: 3 }}>
          <Typography align="left" variant="h5" sx={{ color: palette?.text?.primary }}>
            Photos
          </Typography>
        </Box>

        {instagramUsername ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
              onClick={openInstagramDrawer}>
              <IconButton color="primary" sx={{ padding: 0 }}>
                <InstagramIcon sx={{ color: 'primary.main' }} />
              </IconButton>
              <Typography
                align="left"
                variant="subtitle1"
                sx={{
                  ml: 0.5,
                  mt: 3,
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                {instagramUsername}
              </Typography>
            </Box>
          </>
        ) : null}
      </Box>
      {isUnlinkingInstagram ? <Loader /> : null}
      {[...(firstSplittedPhotos ?? [])]?.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5
          }}>
          <>
            <Box>
              {firstSplittedPhotos?.map((photo) => (
                <img
                  key={photo}
                  src={photo}
                  alt="profile"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginBottom: 8,
                    boxShadow: shadows[5]
                  }}
                  onClick={() => setPreviewModalImageUrl(photo)}
                />
              ))}
            </Box>
            <Box>
              {secondSplittedPhotos?.map((photo) => (
                <img
                  key={photo}
                  src={photo}
                  alt="profile"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginBottom: 8,
                    boxShadow: shadows[5]
                  }}
                  onClick={() => setPreviewModalImageUrl(photo)}
                />
              ))}
            </Box>
          </>
        </Box>
      ) : !isOtherProfile ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <ActionButton
            onClick={openInstagramDrawer}
            // size="small"
            sx={{ mt: 1, fontSize: 20 }}
            startIcon={<InstagramIcon sx={{ color: 'inherit', fontSize: '24px !important' }} />}
            text="Connect Instagram"></ActionButton>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'center', px: 4, mt: 1, color: 'primary.main' }}>
            Share your photos from instagram so others can know you better!
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default ProfileGallery;
