import { Typography, Box, Chip } from "@mui/material";
import React from "react";

interface IProps {
  description?: string;
  tags: string[];
}

const ActivityDescriptionTags: React.FC<IProps> = ({ description, tags }) => {
  return (
    <>
      <Typography variant="h5" align="left" sx={{ mt: 2.5 }}>
        Additional description
      </Typography>
      <Typography
        variant="h6"
        align="left"
        sx={{ width: "90%", margin: "auto" }}
      >
        {description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          my: 2,
          px: 3,
          // overflowWrap: "wrap",
        }}
      >
        {tags?.map((tag) => (
          <Chip
            label={tag}
            key={tag}
            sx={{
              p: 2.5,
              borderRadius: "10px",
              fontSize: "14px",
              textTransform: "capitalize",
            }}
            color="primary"
          />
        ))}
      </Box>
    </>
  );
};

export default ActivityDescriptionTags;
