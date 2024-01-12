import { yupResolver } from '@hookform/resolvers/yup';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import {
  Autocomplete,
  Box,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import FileUploadModal from 'components/file-upload/components/file-upload-modal';
import OffliButton from 'components/offli-button';
import 'dayjs/locale/sk';
import React, { useEffect } from 'react';
import { Controller, ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import SetOnMapScreen from 'screens/set-on-map-screen/set-on-map-screen';
import { toast } from 'sonner';
import { IActivity } from 'types/activities/activity.dto';
import { ILocation } from 'types/activities/location.dto';
import { useDebounce } from 'use-debounce';
import { ACTIVITY_ASPECT_RATIO, ALLOWED_PHOTO_EXTENSIONS } from 'utils/common-constants';
import {
  getLocationFromQueryFetch,
  updateActivity,
  uploadFile
} from '../../api/activities/requests';
import { PageWrapper } from '../../components/page-wrapper';
import { ACTIVITIES_QUERY_KEY, useActivities } from '../../hooks/use-activities';
import { useGetApiUrl } from '../../hooks/use-get-api-url';
import { useTags } from '../../hooks/use-tags';
import { IActivityRestDto } from '../../types/activities/activity-rest.dto';
import { ActivityVisibilityEnum } from '../../types/activities/activity-visibility-enum.dto';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { mapLocationValue } from '../../utils/map-location-value.util';
import { IAdditionalHelperActivityInterface, validationSchema } from './utils/validation-schema';
import { IPlaceExternalApiResultDto } from 'types/activities/place-external-api.dto';
import {
  getHistorySearchesFromStorage,
  pushSearchResultIntoStorage
} from 'utils/search-history-utils';

const EditActivityScreen: React.FC = () => {
  const [localFile, setLocalFile] = React.useState<any>();
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const baseUrl = useGetApiUrl();
  const { userInfo } = React.useContext(AuthenticationContext);
  const [showMap, setShowMap] = React.useState(false);
  const { data: { data: { tags: predefinedTags = [] } = {} } = {} } = useTags();

  const mappedTags = predefinedTags?.map(({ title }) => title);

  const { data: { data: { activity = {} } = {} } = {} } = useActivities<IActivityRestDto>({
    params: {
      id: Number(id)
    }
  });

  const handleFileUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLocalFile(URL.createObjectURL(file));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { dirtyFields = [], isValid }
  } = useForm<IActivity & IAdditionalHelperActivityInterface>({
    defaultValues: {
      title: '',
      description: '',
      location: null,
      datetime_from: new Date(),
      datetime_until: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      visibility: ActivityVisibilityEnum.public,
      // limit: '',
      // price: 0,
      tags: []
    },
    resolver: yupResolver(validationSchema()),
    mode: 'onChange'
  });

  const [queryString] = useDebounce(watch('placeQuery'), 1000);

  const placeQuery = useQuery(
    ['locations', queryString],
    () => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString
    }
  );

  useEffect(() => {
    reset({
      ...activity,
      datetime_from: activity?.datetime_from?.toString(),
      datetime_until: activity?.datetime_until?.toString()
    });
  }, [activity]);

  const { mutate: sendUpdateActivity, isLoading: isUpdatingActivity } = useMutation(
    ['update-profile-info'],
    (values: IActivity) => updateActivity(Number(id), values),
    {
      onSuccess: () => {
        !!localFile && setLocalFile(null);
        queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries(['activity-participants']);
        toast.success('Activity information was successfully updated');
        navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${id}`, {
          state: {
            from: ApplicationLocations.EDIT_ACTIVITY
          }
        });
      },
      onError: () => {
        !!localFile && setLocalFile(null);
        toast.error('Failed to update activity info');
      }
    }
  );

  const { mutate: sendUploadActivityPhoto } = useMutation(
    ['activity-photo-upload'],
    (formData?: FormData) => uploadFile(formData),
    {
      onSuccess: (data) => {
        const values = getValues();
        sendUpdateActivity({
          ...values,
          creator_id: Number(userInfo?.id),
          title_picture: data?.data?.filename
        });
        setValue('title_picture', data?.data?.filename);
        // setLocalFile(null);
      },
      onError: () => {
        setLocalFile(null);
        toast.error('Failed to upload activity photo');
      }
    }
  );

  const dateFrom = watch('datetime_from');
  const dateUntil = watch('datetime_until');

  const handleLocationSaveFromMap = React.useCallback(
    (location: ILocation | null) => {
      if (location) {
        setValue('location', location);
      }
      setShowMap(false);
    },
    [setValue]
  );

  const handleFormSubmit = React.useCallback(
    (values: IActivity) => {
      // let newValues = {};
      // Object.keys(dirtyFields).forEach((field: string) => {
      //   newValues = { ...newValues, [field]: (values as any)?.[field] };
      // });
      // newValues = { ...newValues, tags: }
      sendUpdateActivity({ ...values, creator_id: Number(userInfo?.id) });
    },
    [dirtyFields]
  );

  const handleLocationSelect = React.useCallback(
    (field: ControllerRenderProps<FieldValues, 'location'>) =>
      (
        e: React.SyntheticEvent<Element, Event>,
        locationObject: IPlaceExternalApiResultDto | null
      ) => {
        field.onChange(
          locationObject
            ? {
                name: locationObject?.formatted,
                coordinates: {
                  lat: locationObject?.lat,
                  lon: locationObject?.lon
                }
              }
            : null
        );
        if (locationObject && placeQuery?.data?.results) {
          pushSearchResultIntoStorage(locationObject);
        }
      },
    [setValue, placeQuery?.data?.results]
  );

  return (
    <>
      <FileUploadModal
        uploadFunction={(formData) => sendUploadActivityPhoto(formData)}
        localFile={localFile}
        onClose={() => setLocalFile(null)}
        aspectRatio={390 / 300}
      />
      {showMap ? (
        <SetOnMapScreen onLocationSave={handleLocationSaveFromMap} activity={activity} />
      ) : (
        <PageWrapper sxOverrides={{ mt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
            <input
              onChange={handleFileUpload}
              type="file"
              style={{ display: 'none' }}
              ref={hiddenFileInput}
              // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
              value={''}
              accept="image/*"
            />
            {activity?.title_picture ? (
              <Box sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    onClick={() => console.log('change profile photo')}
                    // todo add default picture in case of missing photo
                    src={`${baseUrl}/files/${activity?.title_picture}`}
                    alt="profile"
                    style={{
                      width: '100%',
                      aspectRatio: ACTIVITY_ASPECT_RATIO
                    }}
                  />
                </Box>
                <OffliButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 150,
                    right: 10,
                    opacity: 0.8,
                    px: 2,
                    py: 1,
                    fontSize: 14
                  }}
                  onClick={() => hiddenFileInput?.current?.click()}>
                  Edit photo
                </OffliButton>
              </Box>
            ) : null}

            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '86%'
              }}
              onSubmit={handleSubmit(handleFormSubmit)}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      mt: 3
                    }}>
                    <Typography variant="h4">General information</Typography>
                    <TextField
                      {...field}
                      label="Title"
                      variant="outlined"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%', mt: 3, mb: 2 }}
                    />
                  </Box>
                )}
              />
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'center'
                    }}>
                    <Autocomplete
                      {...field}
                      options={placeQuery?.data?.results ?? getHistorySearchesFromStorage()}
                      value={mapLocationValue(field?.value)}
                      isOptionEqualToValue={(option, value) =>
                        option?.formatted === (value?.formatted ?? value?.name)
                      }
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                      loading={placeQuery?.isLoading}
                      onChange={handleLocationSelect(field)}
                      getOptionLabel={(option) => String(option?.formatted)}
                      // inputValue={inputValue ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search place"
                          onChange={(e) => setValue('placeQuery', e.target.value)}
                        />
                      )}
                      data-testid="activity-place-input"
                    />
                    <IconButton onClick={() => setShowMap(true)}>
                      <AddLocationAltIcon
                        sx={{
                          color: ({ palette }) => palette?.primary?.main,
                          ml: 1,
                          bgcolor: ({ palette }) => palette?.primary?.light,
                          borderRadius: '10px',
                          p: 1.75
                        }}
                      />
                    </IconButton>
                  </Box>
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sk">
                <Controller
                  name="datetime_from"
                  control={control}
                  render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                    <DateTimePicker
                      {...field}
                      disablePast
                      maxDate={dateUntil}
                      label="Start date"
                      onChange={(e) => onChange(e)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          error={!!error}
                          helperText={error?.message}
                          sx={{
                            width: '100%',
                            mt: 3
                          }}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="datetime_until"
                  control={control}
                  render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                    <DateTimePicker
                      {...field}
                      label="End date"
                      minDate={dateFrom}
                      disablePast
                      onChange={(e) => onChange(e)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          error={!!error}
                          helperText={error?.message}
                          sx={{
                            width: '100%',
                            mt: 3
                          }}
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>

              {predefinedTags ? (
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      id="tags-standard"
                      options={mappedTags}
                      onChange={(e, collectedTags) => {
                        field.onChange(collectedTags);
                      }}
                      defaultValue={[]}
                      sx={{
                        minWidth: '100%',
                        '& .MuiOutlinedInput-root': {
                          height: 'auto'
                        },
                        mt: 2
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // variant="outlined"
                          label="Select categories"
                          placeholder="Favorites"
                        />
                      )}
                    />
                  )}
                />
              ) : null}
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                <Controller
                  name="limit"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Maximum attendance"
                      variant="outlined"
                      error={!!error}
                      helperText={error?.message}
                      InputLabelProps={{ shrink: true }}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '55%', mt: 3 }}
                    />
                  )}
                />
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="number"
                      {...field}
                      label="Price"
                      variant="outlined"
                      error={!!error}
                      helperText={error?.message}
                      InputLabelProps={{ shrink: true }}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '40%', mt: 3 }}
                    />
                  )}
                />
              </Box>

              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: '100%',
                      justifyContent: 'space-around',
                      mt: 2
                    }}>
                    <Typography sx={{ fontWeight: 600 }}>Who can join the activity ?</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RadioGroup
                        {...field}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        sx={{
                          justifyContent: 'center',
                          mt: 1,
                          '& .MuiSvgIcon-root': {
                            color: 'primary.main'
                          },
                          ml: 2
                        }}
                        color="primary.main">
                        <FormControlLabel
                          value={ActivityVisibilityEnum.public}
                          control={<Radio />}
                          label="Anyone"
                        />
                        <FormControlLabel
                          value={ActivityVisibilityEnum.private}
                          control={<Radio color="primary" />}
                          label="Invited users only"
                        />
                      </RadioGroup>
                    </Box>
                  </Box>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    error={!!error}
                    label="Additional description"
                    placeholder="Type more info about the activity"
                    sx={{
                      mt: 3,
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        height: 'unset'
                      }
                    }}
                    inputProps={{ maxLength: 200 }}
                    helperText={`${field?.value?.length ?? 0}/200`}
                    data-testid="description-input"
                  />
                )}
              />

              <OffliButton
                size="small"
                type="submit"
                sx={{ my: 4, width: '60%' }}
                disabled={!isValid}
                isLoading={isUpdatingActivity}>
                Save
              </OffliButton>
            </form>
          </Box>
        </PageWrapper>
      )}
    </>
  );
};
export default EditActivityScreen;
