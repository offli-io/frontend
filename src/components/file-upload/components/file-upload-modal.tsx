import { Box, Modal, useTheme } from "@mui/material";
import OffliButton from "components/offli-button";
import { useSnackbar } from "notistack";
import React from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/crop-utils";

export interface IResolution {
  width: number;
  height: number;
}

interface IFileUploadModalProps {
  uploadFunction?: (data?: FormData) => void;
  open?: boolean;
  onClose?: () => void;
  localFile: string;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  resizeResolution?: IResolution;
}

const FileUploadModal: React.FC<IFileUploadModalProps> = ({
  uploadFunction,
  onClose,
  localFile,
  aspectRatio = 1,
  cropShape = "rect",
  resizeResolution,
  ...rest
}) => {
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const { palette } = useTheme();

  const onCropComplete = React.useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCloseModal = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const cropAndUploadImage = React.useCallback(async () => {
    setIsImageUploading(true);

    try {
      const croppedImage: any = await getCroppedImg(
        localFile,
        croppedAreaPixels,
        resizeResolution
      );
      if (!!croppedImage) {
        const formData = new FormData();
        // we now only have string from createObjectURL, now we need to resolve it
        // Creates a 'blob:nodedata:...' URL string that represents the given <Blob> object and can be used to retrieve the Blob later.
        let blobImage = await fetch(croppedImage).then((r) => r.blob());
        formData.append("file", blobImage, "Idk.jpg");

        uploadFunction?.(formData);
      }
    } catch (e) {
      setIsImageUploading(false);

      console.error(e);
    }
  }, [croppedAreaPixels, localFile, uploadFunction]);

  return (
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
          width: "95%",
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
          <Box sx={{ position: "relative", height: 350, width: "100%"}}>
            <Cropper
              image={localFile}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{
                containerStyle: {
                  color: "transparent",
                },
              }}
              cropShape={cropShape}
              //   objectFit="cover"
            />
          </Box>
          <OffliButton
            sx={{ mt: 4, width: "80%" }}
            onClick={cropAndUploadImage}
            isLoading={isImageUploading}
          >
            Crop
          </OffliButton>
        </Box>
      </Box>
    </Modal>
  );
};
export default FileUploadModal;
