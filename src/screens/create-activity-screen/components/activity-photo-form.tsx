import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import Upload from "rc-upload";
import { RcFile } from "rc-upload/lib/interface";
import React, { BaseSyntheticEvent } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { DEFAULT_DEV_URL } from "../../../assets/config";
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
import { fileToBlob } from "../utils/file-to-blob";

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

  const checkFileBeforeUpload = React.useCallback(
    (file: RcFile) => {
      // check file size
      if (file?.size > MAX_FILE_SIZE) {
        enqueueSnackbar("File is too large", { variant: "error" });
        return false;
      }

      // check file format
      const fileExtension = file.name.split(".").pop();
      if (fileExtension && !ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
        enqueueSnackbar("Unsupported file format", { variant: "error" });
        return false;
      }
      return true;
    },
    [enqueueSnackbar]
  );

  const handleSuccessfullFileUpload = React.useCallback(
    (result: Record<string, unknown>, file: RcFile) => {
      enqueueSnackbar("Your photo has been successfully uploaded", {
        variant: "success",
      });
      setValue("title_picture_url", "link");
    },
    [enqueueSnackbar, setValue]
  );

  const handleFileUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) {
        return;
      }
      const formData = new FormData();
      const blob = await fileToBlob(file);

      formData.append("file", blob, file.name);

      // Make your HTTP request with the formData
      // For example, using the Fetch API:
      const response = await fetch(`${DEFAULT_DEV_URL}/files`, {
        method: "POST",
        body: formData,
      });
    },
    []
  );

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
          alignItem: "center",
          mb: 6,
        }}
      >
        {selectedPhoto ? (
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
              style={{
                width: 250,
                height: 200,
                border: `1px solid ${palette?.primary.main}`,
                borderRadius: 5,
                boxShadow: "2px 3px 3px #ccc",
              }}
              alt="Selected img"
              data-testid="activity-selected-img"
            />
            <OffliButton
              variant="text"
              sx={{ mt: 2, fontSize: 16 }}
              size="small"
              onClick={() => setValue("title_picture_url", undefined)}
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
                  // <Upload
                  //   name="file"
                  //   // value={field.value?.[0]}
                  //   // data={(file) => {
                  //   //   console.log(file);
                  //   //   const formData = new FormData();
                  //   //   formData.append("file", file);
                  //   //   return formData as any;
                  //   // }}
                  //   style={{ display: "flex", justifyContent: "center" }}
                  //   beforeUpload={checkFileBeforeUpload}
                  //   onSuccess={handleSuccessfullFileUpload}
                  //   onError={() =>
                  //     enqueueSnackbar("Failed to upload photo", {
                  //       variant: "error",
                  //     })
                  //   }
                  //   action={() => `${DEFAULT_DEV_URL}/files`}
                  //   headers={{
                  //     authorization: `Bearer ${token}`,
                  //     "Content-type": "multipart/form-data",
                  //   }}
                  // >

                  <Box
                    sx={{
                      width: 200,
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
                  width: 200,
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
