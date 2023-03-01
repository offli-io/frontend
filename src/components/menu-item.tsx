import { Box, Typography } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SettingsTypeEnumDto } from "../types/common/settings-type-enum.dto";
import { ActivityActionsTypeEnumDto } from "../types/common/activity-actions-type-enum.dto";
import { BuddyActionTypeEnum } from "../types/common/buddy-actions-type-enum.dto";

interface ILabeledDividerProps {
  label?: string;
  onMenuItemClick?: (
    type?:
      | SettingsTypeEnumDto
      | ActivityActionsTypeEnumDto
      | BuddyActionTypeEnum
  ) => void;
  type?: SettingsTypeEnumDto | ActivityActionsTypeEnumDto | BuddyActionTypeEnum;
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
        <Typography sx={{ ml: 2, color: "black" }}>{label}</Typography>
      </Box>
      {headerRight ?? <NavigateNextIcon />}
    </Box>
  );
};
export default MenuItem;
