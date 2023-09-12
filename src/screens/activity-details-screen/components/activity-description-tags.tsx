import { Typography, Box, Chip } from "@mui/material";
import React from "react";
import ActivityTags from "./activity-tags";

interface IProps {
  description?: string;
  tags: string[];
}

const ActivityDescriptionTags: React.FC<IProps> = ({ description, tags }) => {
  return (
    <>
      <Typography
        variant="h5"
        align="left"
        sx={{ mt: 1, color: ({ palette }) => palette?.text?.primary }}
      >
        Additional description
      </Typography>
      <ActivityTags tags={tags} sx={{ mt: 1, mb: 0 }} />
    </>
  );
};

export default ActivityDescriptionTags;
