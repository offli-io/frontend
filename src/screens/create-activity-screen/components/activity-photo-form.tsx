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
import { useGetApiUrl } from "../../../hooks/use-get-api-url";
import FileUpload from "components/file-upload/file-upload";

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
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const baseUrl = useGetApiUrl();
  const { enqueueSnackbar } = useSnackbar();
  const { palette } = useTheme();
  const tags = watch("tags");
  const selectedPhoto = watch("title_picture");
  const [croppedImage, setCroppedImage] = React.useState<any>(null);

  const openGallery = React.useCallback(
    () =>
      toggleDrawer({
        open: true,
        content: (
          <OffliGallery
            tags={tags}
            onPictureSelect={(url) => {
              setValue("title_picture", url);
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
        setIsImageUploading(false);
        enqueueSnackbar("Your photo has been successfully uploaded", {
          variant: "success",
        });
        // setLocalFile(null);
        setValue("title_picture", data?.data?.filename);
      },
      onError: (error) => {
        setIsImageUploading(false);
        enqueueSnackbar("Failed to upload activity photo", {
          variant: "error",
        });
      },
    }
  );

  const handleResetSelectedPhoto = React.useCallback(() => {
    setCroppedImage(null);
    setValue("title_picture", undefined);
  }, [setValue]);

  return (
    <>
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
              src={`${baseUrl}/files/${selectedPhoto}`}
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
              name="title_picture"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <FileUpload
                    uploadFunction={(formData) =>
                      sendUploadActivityPhoto(formData)
                    }
                  />
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
