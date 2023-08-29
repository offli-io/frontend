import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { getPredefinedTags } from "../../../api/activities/requests";
import LabeledTile from "../../../components/labeled-tile";
import OffliButton from "../../../components/offli-button";
import { useGetApiUrl } from "../../../hooks/use-get-api-url";

interface IActivityTypeFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn;
}

export const ActivityTypeForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods,
}) => {
  const { control, setValue, watch } = methods;
  const { palette } = useTheme();
  const baseUrl = useGetApiUrl();

  const tags: string[] = watch("tags") ?? [];

  const { data: { data: { tags: tiles = [] } = {} } = {}, isLoading } =
    useQuery(["predefined-tags"], () => getPredefinedTags(), {});

  const handleTileClick = React.useCallback(
    (title: string) => {
      if (tags?.includes(title)) {
        const updatedTags = tags.filter((tag: string) => tag !== title);
        setValue("tags", updatedTags);
      } else {
        const updatedTags = [...tags, title];
        setValue("tags", updatedTags);
      }
    },
    [tags, setValue]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography variant="h2" sx={{ mr: 1, color: "primary.main" }}>
            Choose
          </Typography>
          <Typography variant="h2" sx={{ color: palette.text.primary }}>
            category
          </Typography>
        </Box>
        <Typography variant="subtitle2">
          You can pick none, or more categories
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              my: 4,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : tiles?.length > 0 ? (
          tiles?.map((tag, index) => (
            <LabeledTile
              key={index}
              title={tag.title}
              onClick={handleTileClick}
              selected={tags?.includes(tag.title)}
              sx={{
                width: "42%",
                mb: 2,
              }}
              //TODO construct URL
              imageUrl={`${baseUrl}/predefined/tags/${tag.id}`}
            />
          ))
        ) : (
          <Box sx={{ mt: 4, mb: 10 }}>
            <Typography
              sx={{ color: palette.text.primary, textAlign: "center" }}
            >
              Unfortunately there are no pre-defined categories to use
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <IconButton
          onClick={onBackClicked}
          color="primary"
          data-testid="back-btn"
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <OffliButton
          onClick={onNextClicked}
          sx={{ width: "40%" }}
          data-testid="next-btn"
        >
          Next
        </OffliButton>
      </Box>
    </>
  );
};
