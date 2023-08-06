import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import Cropper from "react-easy-crop";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import * as yup from "yup";
import {
  getLocationFromQueryFetch,
  uploadFile,
} from "../../api/activities/requests";
import { updateProfileInfo } from "../../api/users/requests";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import { useUser } from "../../hooks/use-user";
import { ILocation } from "../../types/activities/location.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import {
  ALLOWED_PHOTO_EXTENSIONS,
  MAX_FILE_SIZE,
} from "../../utils/common-constants";
import { mapExternalApiOptions } from "../../utils/map-location-value.util";
import getCroppedImg from "../create-activity-screen/utils/crop-utils";
import ProfilePhotoActions, {
  ProfilePhotoActionsEnum,
} from "./components/profile-photo-actions";
import { getMatchingProperties } from "./utils/get-matching-properties.util";
import { useGetApiUrl } from "../../hooks/use-get-api-url";

export interface IEditProfile {
  username?: string;
  about_me?: string;
  location?: ILocation | null;
  birthdate?: Date | null;
  // instagram?: string | null;
  placeQuery?: string;
  profile_photo?: string | null;
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    username: yup.string().defined().required("Please enter your username"),
    about_me: yup.string().notRequired(),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup
          .object({
            lat: yup.number().defined().required(),
            lon: yup.number().defined().required(),
          })
          .defined()
          .required(),
      })
      .nullable(true),
    birthdate: yup.date().nullable(true).notRequired(),
    placeQuery: yup.string().notRequired(),
    // instagram: yup.string().nullable(true).notRequired(),
    profile_photo: yup.string().notRequired().nullable(true),
  });

const EditProfileScreen: React.FC = () => {
  const { palette } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const [localImageFile, setLocalImageFile] = React.useState<any>();
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState<any>(null);
  const baseUrl = useGetApiUrl();

  const { mutate: sendUpdateProfile, isLoading: isSubmitting } = useMutation(
    ["update-profile-info"],
    (values: IEditProfile) =>
      //TODO handle location through autocomplete
      updateProfileInfo(userInfo?.id, {
        ...values,
      }),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        //close drawer mby from upload pictures
        toggleDrawer({
          open: false,
          content: undefined,
        });
        queryClient.invalidateQueries(["user"]);
        enqueueSnackbar("Your personal information was successfully updated", {
          variant: "success",
        });
        navigate(ApplicationLocations.PROFILE);
      },
      onError: () => {
        enqueueSnackbar("Failed to update your personal info", {
          variant: "error",
        });
      },
    }
  );

  const { data: { data = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { dirtyFields },
    reset,
    setValue,
  } = useForm<IEditProfile>({
    defaultValues: {
      username: "",
      about_me: "",
      // location: "",
      birthdate: null,
      location: null,
      // instagram: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString,
    }
  );

  const { mutate: sendUploadProfilePhoto, isLoading } = useMutation(
    ["activity-photo-upload"],
    (formData?: FormData) => uploadFile(formData),
    {
      onSuccess: (data) => {
        // Dont display 2 snackbars (1 is already displayed when profile is updated)
        // enqueueSnackbar("Your profile photo has been successfully uploaded", {
        //   variant: "success",
        // });
        setLocalImageFile(null);
        //TODO construct server url
        sendUpdateProfile({ profile_photo: data?.data?.fileName });
        queryClient.invalidateQueries(["user"]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to upload profile photo", {
          variant: "error",
        });
      },
    }
  );

  useEffect(() => {
    // alebo setValue ak bude resetu kurovat

    reset({
      username: data?.username ?? "",
      about_me: data?.about_me ?? "",
      birthdate: (data?.birthdate as Date) ?? null,
      location: data?.location ?? null,
      // instagram: data?.instagram,
      profile_photo: data?.profile_photo,
    });
  }, [data]);

  const handleFormSubmit = React.useCallback(
    (values: IEditProfile) => {
      const updatedValues = getMatchingProperties(values, dirtyFields);
      sendUpdateProfile(updatedValues);
    },
    [dirtyFields]
  );

  const handleProfilePhotoAction = React.useCallback(
    (action?: ProfilePhotoActionsEnum) => {
      switch (action) {
        case ProfilePhotoActionsEnum.SELECT_FROM_DEVICE:
          return hiddenFileInput?.current?.click();
        case ProfilePhotoActionsEnum.REMOVE_PICTURE:
          return sendUpdateProfile({ profile_photo: null });
        default:
          return;
      }
    },
    [hiddenFileInput]
  );

  const handlePictureClick = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: <ProfilePhotoActions onActionClick={handleProfilePhotoAction} />,
    });
  }, [toggleDrawer]);

  const handleFileUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) {
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        enqueueSnackbar("File is too large", { variant: "error" });
        return;
      }

      // check file format
      const fileExtension = file.name.split(".").pop();
      if (fileExtension && !ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
        enqueueSnackbar("Unsupported file format", { variant: "error" });
        return;
      }
      setLocalImageFile(URL.createObjectURL(file));
    },
    []
  );

  const handleCloseModal = React.useCallback(() => {
    setLocalImageFile(null);
  }, []);

  const onCropComplete = React.useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const submitCroppedPhoto = React.useCallback(async () => {
    try {
      const croppedImage: any = await getCroppedImg(
        localImageFile,
        croppedAreaPixels
      );
      if (!!croppedImage) {
        const formData = new FormData();
        // we now only have string from createObjectURL, now we need to resolve it
        // Creates a 'blob:nodedata:...' URL string that represents the given <Blob> object and can be used to retrieve the Blob later.
        let blobImage = await fetch(croppedImage).then((r) => r.blob());
        formData.append("file", blobImage, "Idk.jpg");
        sendUploadProfilePhoto(formData);
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <>
      <PageWrapper>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          open={!!localImageFile}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)", // Add backdrop filter to blur the background
            // zIndex: theme.zIndex.modal + 1,
          }}
          onClose={handleCloseModal}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: (theme) => theme.palette.background.paper,
              // boxShadow: (theme) => theme.shadows[5],
              outline: "none",
              width: "90%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: 400,
                width: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", height: 350, width: "100%" }}>
                <Cropper
                  image={localImageFile}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: {
                      color: "transparent",
                    },
                  }}
                  cropShape="round"
                />
              </Box>
              <OffliButton
                sx={{ mt: 4, width: "80%" }}
                onClick={submitCroppedPhoto}
              >
                Crop
              </OffliButton>
            </Box>
          </Box>
        </Modal>
        <Box
          sx={{
            // mt: (HEADER_HEIGHT + 16) / 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Hidden input for photo upload */}
          <input
            onChange={handleFileUpload}
            type="file"
            style={{ display: "none" }}
            ref={hiddenFileInput}
            // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
            value={""}
          />
          <Box sx={{ position: "relative" }} onClick={handlePictureClick}>
            <img
              src={
                data?.profile_photo
                  ? `${baseUrl}/files/${data?.profile_photo}`
                  : userPlaceholder
              }
              alt="profile"
              style={{
                height: "70px",
                width: "70px",
                borderRadius: "50%",
                border: `2px solid ${palette.primary.main}`,
                boxShadow: "5px 5px 20px 0px rgba(0,0,0,0.6)",
              }}
            />
            <OffliButton
              size="small"
              sx={{
                position: "absolute",
                p: 0.5,
                m: 0,
                right: 2,
                bgcolor: palette?.primary?.main,
                width: 20,
                height: 20,
                minWidth: "unset",
              }}
            >
              <AddIcon
                sx={{
                  color: "white",
                }}
              />
            </OffliButton>
          </Box>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            onSubmit={handleSubmit(handleFormSubmit, (data, e) =>
              console.log(data, e)
            )}
            data-testid="edit-profile-form"
          >
            <Box sx={{ width: "90%" }}>
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Username
                    </Typography>
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%", my: 1.5 }}
                      data-testid="name-input"
                      // label="Name"
                    />
                  </>
                )}
              />

              <Controller
                name="about_me"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      About me
                    </Typography>
                    <TextField
                      {...field}
                      multiline
                      rows={3}
                      // label="Type something about you"
                      placeholder="Type something about you"
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          height: "unset",
                        },
                        my: 1.5,
                      }}
                      helperText={`${field?.value?.length ?? 0}/200`}
                      inputProps={{ maxLength: 200 }}
                      data-testid="about-me-input"
                    />
                  </>
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Location
                    </Typography>
                    {/* // We have completely different approach handling location here and in place-form
                  // TODO we should map options to our ILocation object as it is here
                   */}
                    <Autocomplete
                      {...field}
                      options={mapExternalApiOptions(placeQuery?.data?.results)}
                      value={field?.value}
                      // isOptionEqualToValue={(option, value) =>
                      //   option?.formatted === (value?.formatted ?? value?.name)
                      // }
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContentw: "center",
                        my: 1.5,
                      }}
                      loading={placeQuery?.isLoading}
                      onChange={(e, locationObject) => {
                        field.onChange({
                          name: locationObject?.name ?? "",
                          coordinates: locationObject?.coordinates,
                        });
                      }}
                      inputValue={field?.value?.name}
                      getOptionLabel={(option) => String(option?.name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // label="Location"
                          onChange={(e) =>
                            setValue("placeQuery", e.target.value)
                          }
                          error={!!error}
                          helperText={!!error && "Location is required"}
                        />
                      )}
                      data-testid="activity-place-input"
                    />
                  </>
                )}
              />

              {/* TODO outsource this on the Contexes and Adapters level in the App */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="birthdate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: palette?.text?.primary,
                        }}
                      >
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
                            sx={{ width: "100%", my: 1.5 }}
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
              {/* <Controller
                name="instagram"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Instagram
                    </Typography>
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%", my: 1.5 }}
                      data-testid="instagram-username-input"
                      // label="Instagram"
                    />
                  </>
                )}
              /> */}
            </Box>
            <OffliButton
              type="submit"
              sx={{ mt: 3, mb: 2, width: "50%" }}
              isLoading={isSubmitting}
              data-testid="submit-btn"
            >
              Save
            </OffliButton>
          </form>
        </Box>
      </PageWrapper>
    </>
  );
};

export default EditProfileScreen;
