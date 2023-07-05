import { Box, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SettingsTypeEnumDto } from "../types/common/settings-type-enum.dto";
import { ActivityActionsTypeEnumDto } from "../types/common/activity-actions-type-enum.dto";
import { BuddyActionTypeEnum } from "../types/common/buddy-actions-type-enum.dto";
import { ProfilePhotoActionsEnum } from "../screens/edit-profile-screen/components/profile-photo-actions";

interface ILabeledDividerProps {
  label?: string;
  onMenuItemClick?: (
    type?:
      | SettingsTypeEnumDto
      | ActivityActionsTypeEnumDto
      | BuddyActionTypeEnum
      | ProfilePhotoActionsEnum
  ) => void;
  type?:
    | SettingsTypeEnumDto
    | ActivityActionsTypeEnumDto
    | BuddyActionTypeEnum
    | ProfilePhotoActionsEnum;
  icon?: React.ReactElement;
  headerRight?: React.ReactElement;
}

const MenuItem: React.FC<ILabeledDividerProps> = ({
  label,
  type,
  onMenuItemClick,
  icon,
  headerRight,
  ...rest
}) => {
  return (
    <Box
      onClick={() => onMenuItemClick && onMenuItemClick(type)}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        textTransform: "none",
        width: "100%",
        boxSizing: "border-box",
      }}
      {...rest}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <Typography
          sx={{ ml: 2, color: ({ palette }) => palette?.text?.primary }}
        >
          {label}
        </Typography>
      </Box>
      {headerRight ?? (
        <NavigateNextIcon
          sx={{ color: ({ palette }) => palette?.text?.primary }}
        />
      )}
    </Box>
  );
};
export default MenuItem;
