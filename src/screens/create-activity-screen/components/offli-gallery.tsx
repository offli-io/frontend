import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { Box, Chip, CircularProgress, SxProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getPredefinedPhotos } from "../../../api/activities/requests";

interface ITimePickerProps {
  onPictureSelect: (value: string) => void;
  tags?: string[];
}

const OffliGallery: React.FC<ITimePickerProps> = ({
  tags,
  onPictureSelect,
}) => {
  const { data, isLoading } = useQuery(["predefined-photos", tags], () =>
    getPredefinedPhotos(tags)
  );
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
      ) : (
        <Box
          sx={{
            display: "grid",
            //   gridTemplateColumns:
            //     'repeat(auto-fit, minmax(min(100%/3, max(64px, 100%/5)), 1fr))',
            gridTemplateColumns: "1fr 1fr 1fr",
            my: 4,
          }}
        >
          {data?.data?.pictures?.map(({ picture }) => (
            <Box
              sx={{
                maxWidth: "100%",
                m: 0.5,
                boxShadow: "1px 3px 2px #ccc",
              }}
              onClick={() => picture && onPictureSelect(picture)}
              key={picture}
            >
              <img src={picture} style={{ maxWidth: "100%" }} alt="gallery" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OffliGallery;
