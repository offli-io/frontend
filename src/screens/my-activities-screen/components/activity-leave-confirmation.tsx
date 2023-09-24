import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import OffliButton from "../../../components/offli-button";
import { useActivities } from "../../../hooks/use-activities";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";
import { useGetApiUrl } from "hooks/use-get-api-url";

export interface IActivityActionsProps {
  onLeaveConfirm?: (activityId?: number) => void;
  onLeaveCancel?: (activityId?: number) => void;
  activityId?: number;
}

const ActivityLeaveConfirmation: React.FC<IActivityActionsProps> = ({
  onLeaveConfirm,
  onLeaveCancel,
  activityId,
}) => {
  //TODO if no activity display nothing
  const baseUrl = useGetApiUrl();
  const { palette } = useTheme();

  const { data, isLoading } = useActivities<IActivityRestDto>({
    params: {
      id: activityId,
    },
  });
  return isLoading ? (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress color="primary" />
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ my: 2, color: palette?.text?.primary }}>
        Leaving the group
      </Typography>

      <img
        style={{
          height: 70,
          width: 70,
          borderRadius: 35,
          boxShadow: "2px 3px 4px #ccc",
        }}
        src={`${baseUrl}/files/${data?.data?.activity?.title_picture}`}
        alt="Activity leave"
      />
      <Box sx={{ my: 2 }}>
        <Typography sx={{ color: palette?.text?.primary, textAlign: "center" }}>
          Do you really want to leave
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            color: palette?.text?.primary,
            textAlign: "center",
          }}
        >
          {data?.data?.activity?.title} ?
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <OffliButton
          sx={{ width: "40%", fontSize: 16 }}
          variant="outlined"
          onClick={() => onLeaveCancel?.(data?.data?.activity?.id)}
        >
          Cancel
        </OffliButton>
        <OffliButton
          sx={{ width: "40%", fontSize: 16 }}
          onClick={() => onLeaveConfirm?.(data?.data?.activity?.id)}
        >
          Leave
        </OffliButton>
      </Box>
    </Box>
  );
};

export default ActivityLeaveConfirmation;
