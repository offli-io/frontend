import { Box, Modal, SxProps } from "@mui/material";
import React from "react";

export interface IImagePreviewModalProps {
  open?: boolean;
  imageSrc?: string;
  onClose?: () => void;
  sx?: SxProps;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  display: "flex",
  justifyContent: "center",
};

const ImagePreviewModal: React.FC<IImagePreviewModalProps> = ({
  onClose,
  open = false,
  imageSrc,
  sx,
}) => {
  return imageSrc ? (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        },
      }}
    >
      <Box sx={{ ...style, ...sx }}>
        <img src={imageSrc} alt="modal_preview" style={{ maxWidth: "100%" }} />
      </Box>
    </Modal>
  ) : null;
};

export default ImagePreviewModal;
