import { yupResolver } from '@hookform/resolvers/yup';
import EditIcon from '@mui/icons-material/Edit';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Autocomplete, Box, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FileUploadModal from 'components/file-upload/components/file-upload-modal';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import * as yup from 'yup';
import { getLocationFromQueryFetch, uploadFile } from '../../api/activities/requests';
import { unlinkInstagram, updateProfileInfo } from '../../api/users/requests';
import userPlaceholder from '../../assets/img/user-placeholder.svg';
import OffliButton from '../../components/offli-button';
import { PageWrapper } from '../../components/page-wrapper';
import { AuthenticationContext } from '../../context/providers/authentication-provider';
import { DrawerContext } from '../../context/providers/drawer-provider';
import { useGetApiUrl } from '../../hooks/use-get-api-url';
import { useUser } from '../../hooks/use-user';
import { ILocation } from '../../types/activities/location.dto';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { ALLOWED_PHOTO_EXTENSIONS } from '../../utils/common-constants';
import { mapExternalApiOptions } from '../../utils/map-location-value.util';
import ProfilePhotoActions, { ProfilePhotoActionsEnum } from './components/profile-photo-actions';
import { getMatchingProperties } from './utils/get-matching-properties.util';

export interface IEditProfile {
  username?: string;
  about_me?: string;
  location?: ILocation | null;
  birthdate?: Date | null;
  // instagram?: string | null;
  placeQuery?: string;
  profile_photo?: string | null;
  title_photo?: string | null;
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    username: yup.string().defined().required('Please enter your username'),
    about_me: yup.string().notRequired(),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup
          .object({
            lat: yup.number().defined().required(),
            lon: yup.number().defined().required()
          })
          .defined()
          .required()
      })
      .nullable(true),
    birthdate: yup.date().nullable(true).notRequired(),
    placeQuery: yup.string().notRequired(),
    // instagram: yup.string().nullable(true).notRequired(),
    profile_photo: yup.string().notRequired().nullable(true),
    title_photo: yup.string().notRequired()
  });

const EditProfileScreen: React.FC = () => {
  const { palette } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const profilePictureFileInput = React.useRef<HTMLInputElement | null>(null);
  const titlePictureFileInput = React.useRef<HTMLInputElement | null>(null);
  const [localProfileImageFile, setLocalProfileImageFile] = React.useState<any>();
  const [localTitleImageFile, setLocalTitleImageFile] = React.useState<any>();

  const baseUrl = useGetApiUrl();

  const { mutate: sendUpdateProfile, isLoading: isSubmitting } = useMutation(
    ['update-profile-info'],
    (values: IEditProfile) =>
      //TODO handle location through autocomplete
      updateProfileInfo(userInfo?.id, {
        ...values
      }),
    {
      onSuccess: () => {
        toggleDrawer({
          open: false,
          content: undefined
        });
        queryClient.invalidateQueries(['user']);
        toast.success('Your personal information was successfully updated');
        navigate(-1);
        // navigate(ApplicationLocations.PROFILE);
      },
      onError: () => {
        toast.error('Failed to update your personal info');
      }
    }
  );

  const { data: { data: { user = {} } = {} } = {} } = useUser({
    id: userInfo?.id
  });

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields },
    reset,
    setValue
  } = useForm<IEditProfile>({
    defaultValues: {
      username: '',
      about_me: '',
      birthdate: null,
      location: null
      // instagram: "",
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const [queryString] = useDebounce(watch('placeQuery'), 1000);
  // const selectedColor = watch("background_color") ?? palette?.primary?.light;

  const placeQuery = useQuery(
    ['locations', queryString],
    () => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString
    }
  );

  const { mutate: sendUploadPhoto } = useMutation(
    ['activity-photo-upload'],
    (formData?: FormData) => uploadFile(formData),
    {
      onSuccess: (data) => {
        setLocalProfileImageFile(null);
        setLocalTitleImageFile(null);
        //differentiate which photo should be updated
        sendUpdateProfile({
          ...(localProfileImageFile ? { profile_photo: data?.data?.filename } : {}),
          ...(localTitleImageFile ? { title_photo: data?.data?.filename } : {})
        });
        queryClient.invalidateQueries(['user']);
        navigate(ApplicationLocations.PROFILE);
      },
      onError: () => {
        toast.error('Failed to upload profile photo');
      }
    }
  );

  const { isLoading: isUnlinkingInstagram, mutate: sendUnlinkInstagram } = useMutation(
    ['instagram-unlink'],
    () => unlinkInstagram(Number(userInfo?.id)),
    {
      onSuccess: () => {
        toast.success('Your instagram account has been successfully unlinked');
        queryClient.invalidateQueries(['user']);
      },
      onError: () => {
        toast.error('Failed unlinking your instagram account');
      }
    }
  );

  useEffect(() => {
    // alebo setValue ak bude resetu kurovat

    reset({
      username: user?.username ?? '',
      about_me: user?.about_me ?? '',
      birthdate: (user?.birthdate as Date) ?? null,
      location: user?.location ?? null,
      // instagram: data?.instagram,
      profile_photo: user?.profile_photo,
      title_photo: user?.title_photo
      // background_color: data?.background_color,
    });
  }, [user]);

  const handleFormSubmit = React.useCallback(
    (values: IEditProfile) => {
      const updatedValues = getMatchingProperties(values, dirtyFields);
      sendUpdateProfile(updatedValues);
    },
    [dirtyFields]
  );

  const handleProfilePhotoAction = React.useCallback(
    (action?: ProfilePhotoActionsEnum, type?: 'profile' | 'title') => {
      switch (action) {
        case ProfilePhotoActionsEnum.SELECT_FROM_DEVICE:
          return type === 'profile'
            ? profilePictureFileInput?.current?.click()
            : titlePictureFileInput?.current?.click();
        case ProfilePhotoActionsEnum.REMOVE_PICTURE:
          return sendUpdateProfile({
            profile_photo: type === 'profile' ? '' : undefined,
            title_photo: type === 'title' ? '' : undefined
          });
        default:
          return;
      }
    },
    [profilePictureFileInput, titlePictureFileInput]
  );

  // const openColorPicker = React.useCallback(() => {
  //   toggleDrawer({
  //     open: true,
  //     content: (
  //       <ColorPicker
  //         color={selectedColor}
  //         onColorChange={(selectedColor) => {
  //           if (selectedColor === null) {
  //             return;
  //           }
  //           setValue("background_color", selectedColor, {
  //             shouldDirty: true,
  //           });
  //           toggleDrawer({ open: false });
  //         }}
  //       />
  //     ),
  //   });
  // }, [selectedColor]);

  const handlePictureClick = React.useCallback(
    (type: 'profile' | 'title') => {
      toggleDrawer({
        open: true,
        content: (
          <ProfilePhotoActions onActionClick={(action) => handleProfilePhotoAction(action, type)} />
        )
      });
    },
    [toggleDrawer]
  );

  const handleProfilePictureUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) {
        return;
      }

      // check file format
      const fileExtension = file.name.split('.').pop();
      if (fileExtension && !ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
        toast.error('Unsupported file format');
        return;
      }
      setLocalProfileImageFile(URL.createObjectURL(file));
    },
    []
  );

  const handleTitlePictureUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) {
        return;
      }

      // check file format
      const fileExtension = file.name.split('.').pop();
      if (fileExtension && !ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
        toast.error('Unsupported file format');
        return;
      }
      setLocalTitleImageFile(URL.createObjectURL(file));
    },
    []
  );

  return (
    <>
      <PageWrapper sxOverrides={{ mt: 0 }}>
        <FileUploadModal
          uploadFunction={(formData) => sendUploadPhoto(formData)}
          localFile={localProfileImageFile ?? localTitleImageFile}
          onClose={() => {
            setLocalTitleImageFile(null);
            setLocalProfileImageFile(null);
          }}
          aspectRatio={localTitleImageFile ? 375 / 150 : 1}
          cropShape={localTitleImageFile ? 'rect' : 'round'}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
          {/* Hidden input for photo upload */}
          <input
            onChange={handleProfilePictureUpload}
            type="file"
            style={{ display: 'none' }}
            ref={profilePictureFileInput}
            // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
            value={''}
            accept="image/*"
          />

          <input
            onChange={handleTitlePictureUpload}
            type="file"
            style={{ display: 'none' }}
            ref={titlePictureFileInput}
            // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
            value={''}
            accept="image/*"
          />
          <Box
            sx={{ width: '100%', height: 150, position: 'relative', mb: 2 }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              handlePictureClick('title');
            }}>
            <Box sx={{ height: '100%' }}>
              <img
                src={user?.title_photo ? `${baseUrl}/files/${user?.title_photo}` : userPlaceholder}
                alt="title"
                style={{ height: '100%', width: '100%' }}
              />
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  right: 10,
                  top: 10
                }}
                size="small">
                <EditIcon sx={{ color: 'white', fontSize: 20 }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '95%',
                left: '15%',
                transform: 'translate(-50%, -50%)'
              }}>
              <Box
                sx={{ position: 'relative' }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePictureClick('profile');
                }}>
                <img
                  src={
                    user?.profile_photo
                      ? `${baseUrl}/files/${user?.profile_photo}`
                      : userPlaceholder
                  }
                  alt="profile"
                  style={{
                    height: 100,
                    aspectRatio: 1,
                    borderRadius: '50%',
                    border: `2px solid ${palette.primary.main}`,
                    boxShadow: '5px 5px 20px 0px rgba(0,0,0,0.6)'
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '85%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: palette?.primary?.main
                  }}
                  size="small">
                  <EditIcon sx={{ color: 'white', fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
            onSubmit={handleSubmit(handleFormSubmit, (data, e) => console.log(data, e))}
            data-testid="edit-profile-form">
            <Box sx={{ width: '90%', mt: 6 }}>
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography variant="h5">Username</Typography>
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: '100%', my: 1.5 }}
                      data-testid="name-input"
                      // label="Name"
                    />
                  </>
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="birthdate"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <Typography variant="h5" sx={{ mt: 1 }}>
                        Birthdate
                      </Typography>
                      <DatePicker
                        openTo="year"
                        inputFormat="DD/MM/YYYY"
                        value={value}
                        disableFuture
                        // closeOnSelect
                        onChange={onChange}
                        maxDate={new Date()}
                        data-testid="birthdate-date-picker"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: '100%', my: 1.5 }}
                            error={!!error}
                            helperText={error?.message}
                            // label="Birthdate"
                          />
                        )}
                      />
                    </>
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      Location
                    </Typography>
                    {/* // We have completely different approach handling location here and in place-form
                  // TODO we should map options to our ILocation object as it is here
                   */}
                    <Autocomplete
                      {...field}
                      options={mapExternalApiOptions(placeQuery?.data?.results)}
                      value={field?.value}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContentw: 'center',
                        my: 1.5
                      }}
                      loading={placeQuery?.isLoading}
                      onChange={(e, locationObject) => {
                        field.onChange({
                          name: locationObject?.name ?? '',
                          coordinates: locationObject?.coordinates
                        });
                      }}
                      inputValue={field?.value?.name}
                      getOptionLabel={(option) => String(option?.name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // label="Location"
                          onChange={(e) => setValue('placeQuery', e.target.value)}
                          error={!!error}
                          helperText={!!error && 'Location is required'}
                        />
                      )}
                      data-testid="activity-place-input"
                    />
                  </>
                )}
              />
              <Controller
                name="about_me"
                control={control}
                render={({ field }) => (
                  <>
                    <Typography variant="h5" sx={{ mt: 2 }}>
                      About me
                    </Typography>
                    <TextField
                      {...field}
                      multiline
                      rows={3}
                      placeholder="Type something about you"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          height: 'unset'
                        },
                        my: 1.5
                      }}
                      helperText={`${field?.value?.length ?? 0}/200`}
                      inputProps={{ maxLength: 200 }}
                      data-testid="about-me-input"
                    />
                  </>
                )}
              />

              {/* TODO outsource this on the Contexes and Adapters level in the App */}
              {/* <Box>
                <Typography variant="h5">Profile background color</Typography>
                <OffliButton
                  size="small"
                  variant="contained"
                  onClick={openColorPicker}
                  endIcon={
                    <Box
                      sx={{
                        ml: 4,
                        width: 32,
                        height: 32,
                        bgcolor: `${selectedColor}`,
                        border: "1px solid black",
                        borderRadius: 2,
                      }}
                    ></Box>
                  }
                  sx={{
                    bgcolor: palette?.primary?.light,
                    width: "100%",
                    height: 50,
                    mt: 2,
                    color: palette?.primary?.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {selectedColor}
                </OffliButton>
              </Box> */}

              {user?.instagram ? (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center'
                  }}>
                  <OffliButton
                    onClick={() => sendUnlinkInstagram()}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 16, mt: 1, width: '55%' }}
                    startIcon={<InstagramIcon sx={{ color: 'inherit' }} />}
                    isLoading={isUnlinkingInstagram}>
                    Unlink Instagram
                  </OffliButton>
                </Box>
              ) : null}
            </Box>
            <OffliButton
              type="submit"
              sx={{ mt: 4, mb: 2, width: '65%' }}
              isLoading={isSubmitting}
              disabled={isUnlinkingInstagram}
              data-testid="submit-btn">
              Save
            </OffliButton>
          </form>
        </Box>
      </PageWrapper>
    </>
  );
};

export default EditProfileScreen;
