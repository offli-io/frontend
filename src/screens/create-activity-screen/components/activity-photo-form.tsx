import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, IconButton, Modal, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { BaseSyntheticEvent } from "react";
import Cropper from "react-easy-crop";
import { Controller, UseFormReturn } from "react-hook-form";
import "react-image-crop/dist/ReactCrop.css";
import activityPhotoImg from "../../../assets/img/activity-photo.svg";
import { DrawerContext } from "../../../assets/theme/drawer-provider";
import LabeledDivider from "../../../components/labeled-divider";
import OffliButton from "../../../components/offli-button";
import {
  ALLOWED_PHOTO_EXTENSIONS,
  MAX_FILE_SIZE,
} from "../../../utils/common-constants";
import { getAuthToken } from "../../../utils/token.util";
import OffliGallery from "./offli-gallery";
import { uploadFile } from "../../../api/activities/requests";
import getCroppedImg from "../utils/crop-utils";

interface IActivityPhotoFormProps {
  methods: UseFormReturn;
  onBackClicked: () => void;
}

export const ActivityPhotoForm: React.FC<IActivityPhotoFormProps> = ({
  methods,
  onBackClicked,
}) => {
  const { control, formState, watch, setValue } = methods;
  const { toggleDrawer } = React.useContext(DrawerContext);
  const onImageSelect = (e: BaseSyntheticEvent) => {
    console.log(e.target.files);
  };
  const token = getAuthToken();
  const { enqueueSnackbar } = useSnackbar();
  const { palette } = useTheme();
  const tags = watch("tags");
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const selectedPhoto = watch("title_picture_url");
  // const [crop, setCrop] = React.useState<any>({
  //   unit: "%", // Can be 'px' or '%'
  //   width: 100,
  //   height: 70,
  //   x: 25,
  //   y: 25,
  //   // width: 100,
  //   // aspect: 16 / 9,
  // });
  // const [croppedImage, setCroppedImage] = React.useState(null);
  const [localFile, setLocalFile] = React.useState<any>();
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState<any>(null);

  const onCropComplete = React.useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const openGallery = React.useCallback(
    () =>
      toggleDrawer({
        open: true,
        content: (
          <OffliGallery
            tags={tags}
            onPictureSelect={(url) => {
              setValue("title_picture_url", url);
              toggleDrawer({ open: false, content: undefined });
            }}
          />
        ),
      }),
    [toggleDrawer, setValue]
  );

  const { mutate: sendUploadActivityPhoto, isLoading } = useMutation(
    ["activity-photo-upload"],
    (formData?: FormData) => uploadFile(formData),
    {
      onSuccess: (data) => {
        enqueueSnackbar("Your photo has been successfully uploaded", {
          variant: "success",
        });
        setLocalFile(null);
        setValue("title_picture_url", data?.data?.url);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to upload activity photo", {
          variant: "error",
        });
      },
    }
  );

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
      setLocalFile(URL.createObjectURL(file));
    },
    [sendUploadActivityPhoto]
  );

  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage: any = await getCroppedImg(
        localFile,
        croppedAreaPixels
      );
      if (!!croppedImage) {
        const formData = new FormData();
        // we now only have string from createObjectURL, now we need to resolve it
        // Creates a 'blob:nodedata:...' URL string that represents the given <Blob> object and can be used to retrieve the Blob later.
        let blobImage = await fetch(croppedImage).then((r) => r.blob());
        formData.append("file", blobImage, "Idk.jpg");

        sendUploadActivityPhoto(formData);
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const handleCloseModal = React.useCallback(() => {
    setLocalFile(null);
  }, []);

  const handleResetSelectedPhoto = React.useCallback(() => {
    setCroppedImage(null);
    setValue("title_picture_url", undefined);
  }, [setValue]);

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={!!localFile}
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
                image={localFile}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    color: "transparent",
                  },
                }}
              />
            </Box>
            <OffliButton
              sx={{ mt: 4, width: "80%" }}
              onClick={showCroppedImage}
            >
              Crop
            </OffliButton>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          my: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography variant="h2" sx={{ color: "primary.main", mr: 1 }}>
              Add
            </Typography>
            <Typography variant="h2" sx={{ color: palette?.text?.primary }}>
              activity photo
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: (theme) => theme.palette.inactiveFont.main, mt: 0.5 }}
          >
            Later you can add two more photos
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 6,
        }}
      >
        {selectedPhoto || croppedImage ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={selectedPhoto}
              alt="cropped"
              style={{
                width: 280,
                aspectRatio: 4 / 3,
                border: `1px solid ${palette?.primary.main}`,
                borderRadius: 5,
                boxShadow: "2px 3px 3px #ccc",
              }}
            />
            <OffliButton
              variant="text"
              sx={{ mt: 2, fontSize: 16 }}
              size="small"
              onClick={handleResetSelectedPhoto}
              data-testid="choose-different-img-btn"
            >
              Choose different picture
            </OffliButton>
          </Box>
        ) : (
          <>
            <Controller
              name="title_picture_url"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <Box
                    sx={{
                      width: "75%",
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bgcolor:
                        palette?.mode === "light"
                          ? grey[200]
                          : palette?.background?.default,
                      borderRadius: 5,
                      border: (theme) =>
                        `1px dashed ${theme.palette.primary.main}`,
                    }}
                    onClick={() => hiddenFileInput?.current?.click()}
                  >
                    <input
                      onChange={handleFileUpload}
                      type="file"
                      style={{ display: "none" }}
                      ref={hiddenFileInput}
                      // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
                      value={""}
                    />
                    <IconButton size="large" data-testid="upload-img-btn">
                      <AddAPhotoIcon color="primary" />
                    </IconButton>
                    <Typography
                      sx={{ fontSize: 14, color: palette?.text?.primary }}
                    >
                      Upload from your phone
                    </Typography>
                  </Box>
                );
              }}
            />
            <LabeledDivider sx={{ my: 3, width: "100%" }}>
              <Typography variant="subtitle1">or</Typography>
            </LabeledDivider>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={openGallery}
                sx={{
                  width: "75%",
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  // bgcolor: grey[200],
                  bgcolor:
                    palette?.mode === "light"
                      ? grey[200]
                      : palette?.background?.default,
                  borderRadius: 5,
                  border: (theme) => `1px dashed ${theme.palette.primary.main}`,
                }}
                data-testid="open-gallery-btn"
              >
                <img
                  src={activityPhotoImg}
                  style={{ height: 50, marginBottom: 12 }}
                  alt="Activity img"
                />
                <Typography
                  sx={{ fontSize: 14, color: palette?.text?.primary }}
                >
                  Select from Offli
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          onClick={onBackClicked}
          color="primary"
          data-testid="back-btn"
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <OffliButton
          sx={{ width: "60%" }}
          disabled={!formState.isValid || !selectedPhoto}
          type="submit"
          data-testid="create-btn"
        >
          Create
        </OffliButton>
      </Box>
    </>
  );
};
