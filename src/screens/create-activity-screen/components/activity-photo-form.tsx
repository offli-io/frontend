import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FilterIcon from '@mui/icons-material/Filter';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { useMutation } from '@tanstack/react-query';
import FileUpload from 'components/file-upload/file-upload';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'sonner';
import { uploadFile } from '../../../api/activities/requests';
import activityPhotoImg from '../../../assets/img/activity-photo.svg';
import { DrawerContext } from '../../../components/context/providers/drawer-provider';
import LabeledDivider from '../../../components/labeled-divider';
import OffliButton from '../../../components/offli-button';
import { useGetApiUrl } from '../../../hooks/utils/use-get-api-url';
import { ACTIVITY_ASPECT_RATIO } from '../../../utils/common-constants';
import OffliGallery from './offli-gallery';

interface IActivityPhotoFormProps {
  methods: UseFormReturn;
  onBackClicked: () => void;
}

export const ActivityPhotoForm: React.FC<IActivityPhotoFormProps> = ({
  methods,
  onBackClicked
}) => {
  const { control, formState, watch, setValue } = methods;
  const { toggleDrawer } = React.useContext(DrawerContext);
  const baseUrl = useGetApiUrl();
  const { palette } = useTheme();
  const tags = watch('tags');
  const selectedPhoto = watch('title_picture');
  const [croppedImage, setCroppedImage] = React.useState<any>(null);

  const openGallery = React.useCallback(
    () =>
      toggleDrawer({
        open: true,
        content: (
          <OffliGallery
            tags={tags}
            onPictureSelect={(url) => {
              setValue('title_picture', url);
              toggleDrawer({ open: false, content: undefined });
            }}
          />
        )
      }),
    [toggleDrawer, setValue]
  );

  const { mutate: sendUploadActivityPhoto } = useMutation(
    ['activity-photo-upload'],
    (formData?: FormData) => uploadFile(formData),
    {
      onSuccess: (data) => {
        toast.success('Your photo has been successfully uploaded');
        // setLocalFile(null);
        setValue('title_picture', data?.data?.filename);
      },
      onError: () => {
        toast.error('Failed to upload activity photo');
      }
    }
  );

  const handleResetSelectedPhoto = React.useCallback(() => {
    setCroppedImage(null);
    setValue('title_picture', undefined);
  }, [setValue]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center'
        }}>
        <Typography variant="h1" sx={{ color: 'primary.main', mr: 1 }}>
          Add
        </Typography>
        <Typography variant="h1" sx={{ color: palette?.text?.primary }}>
          activity photo
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4
        }}>
        {selectedPhoto || croppedImage ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <img
              src={`${baseUrl}/files/${selectedPhoto}`}
              alt="cropped"
              style={{
                width: '75%',
                aspectRatio: ACTIVITY_ASPECT_RATIO,
                border: `1px solid ${palette?.primary.main}`,
                borderRadius: 15,
                boxShadow: shadows[5]
              }}
            />
            <OffliButton
              variant="text"
              sx={{
                mt: 3,
                fontSize: 16,
                // bgcolor: palette?.primary?.light,
                p: 1,
                px: 2
              }}
              size="small"
              onClick={handleResetSelectedPhoto}
              data-testid="choose-different-img-btn"
              startIcon={<FilterIcon sx={{ color: ({ palette }) => palette?.primary?.main }} />}>
              Choose different picture
            </OffliButton>
          </Box>
        ) : (
          <>
            <Controller
              name="title_picture"
              control={control}
              render={() => {
                return (
                  <FileUpload uploadFunction={(formData) => sendUploadActivityPhoto(formData)} />
                );
              }}
            />
            <LabeledDivider sx={{ my: 3, width: '100%' }}>
              <Typography variant="subtitle1">or</Typography>
            </LabeledDivider>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Box
                onClick={openGallery}
                sx={{
                  width: '65%',
                  height: 130,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  bgcolor: palette?.primary?.light,
                  // bgcolor: palette?.mode === 'light' ? palette?.primary?.light : grey[200],
                  borderRadius: 5,
                  border: (theme) => `1px dashed ${theme.palette.primary.main}`
                }}
                data-testid="open-gallery-btn">
                <img
                  src={activityPhotoImg}
                  style={{ height: 70, marginBottom: 12 }}
                  alt="Activity img"
                />
                <Typography sx={{ fontSize: 16, color: palette?.primary?.main }}>
                  Select from Offli
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
        <IconButton
          onClick={onBackClicked}
          color="primary"
          data-testid="back-btn"
          sx={{ fontSize: 20 }}>
          <ArrowBackIosNewIcon sx={{ color: 'inherit', mr: 1 }} />
          Back
        </IconButton>

        <OffliButton
          sx={{ width: '50%', height: 50 }}
          disabled={!formState.isValid || !selectedPhoto}
          type="submit"
          data-testid="create-btn">
          Create
        </OffliButton>
      </Box>
    </>
  );
};
