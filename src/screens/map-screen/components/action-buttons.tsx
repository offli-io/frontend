import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageviewIcon from "@mui/icons-material/Pageview";
import { Box } from "@mui/material";
import { DrawerContext } from "assets/theme/drawer-provider";
import OffliButton from "components/offli-button";
import React from "react";
import { useParams } from "react-router-dom";

interface IActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isCreator?: boolean;
  onJoinClick?: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
}

const ActionButtons: React.FC<IActionButtonsProps> = ({
  isAlreadyParticipant,
  isCreator,
  onJoinClick,
  areActionsLoading,
  isPublic,
}) => {
  const { id } = useParams();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        my: 2,
      }}
    >
      {isPublic ? (
        <>
          <OffliButton
            size="small"
            sx={{
              fontSize: 18,
              width: "40%",
              height: 48,
              color: isAlreadyParticipant
                ? "primary.main"
                : "background.default",
            }}
            onClick={onJoinClick}
            color={!isAlreadyParticipant ? "primary" : "secondary"}
            isLoading={areActionsLoading}
            startIcon={
              isAlreadyParticipant ? (
                <CheckCircleIcon sx={{ color: "primary.main" }} />
              ) : (
                <CheckCircleOutlineIcon sx={{ color: "background.default" }} />
              )
            }
          >
            {isAlreadyParticipant ? (isCreator ? "Dismiss" : "Joined") : "Join"}
          </OffliButton>
          <OffliButton
            size="small"
            disabled={!isAlreadyParticipant || areActionsLoading}
            sx={{
              fontSize: 18,
              width: "40%",
              height: 48,
              bgcolor: "primary.light",
              color: "primary.main",
            }}
            onClick={() => {}}
            startIcon={
              <PageviewIcon
                sx={{
                  color: isAlreadyParticipant
                    ? "primary.main"
                    : "inactiveFont.main",
                }}
              />
            }
          >
            View
          </OffliButton>
        </>
      ) : null}
    </Box>
  );
};

export default ActionButtons;
