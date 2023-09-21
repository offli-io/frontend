import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { getPredefinedPhotos } from "../../../api/activities/requests";
import { useGetApiUrl } from "hooks/use-get-api-url";

interface ITimePickerProps {
  onPictureSelect: (value: string) => void;
  tags?: string[];
}

const OffliGallery: React.FC<ITimePickerProps> = ({
  tags,
  onPictureSelect,
}) => {
  const baseUrl = useGetApiUrl();
  const { data: { data: { pictures = [], count = 0 } = {} } = {}, isLoading } =
    useQuery(["predefined-photos", tags], () => getPredefinedPhotos(tags));
  return (
    <Box>
      {tags?.map((tag) => (
        <Chip label={tag} key={tag} sx={{ mx: 1, my: 0.5 }} color="primary" />
      ))}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : count > 0 ? (
        <Box
          sx={{
            display: "grid",
            //   gridTemplateColumns:
            //     'repeat(auto-fit, minmax(min(100%/3, max(64px, 100%/5)), 1fr))',
            gridTemplateColumns: "1fr 1fr 1fr",
            my: 4,
          }}
        >
          {pictures.map(({ name }, index) => (
            <Box
              sx={{
                maxWidth: "100%",
                m: 0.5,
                boxShadow: "1px 3px 2px #ccc",
              }}
              onClick={() => name && onPictureSelect(name)}
              key={`predefined_picture_${name}`}
              data-testid="offli-gallery-img-btn"
            >
              <img
                src={`${baseUrl}/files/${name}`}
                style={{ maxWidth: "100%" }}
                alt="gallery"
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
          }}
        >
          <Typography sx={{ color: (theme) => theme?.palette?.text?.primary }}>
            There are no available pre-defined pictures
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OffliGallery;
