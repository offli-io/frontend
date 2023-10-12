import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import { Box } from "@mui/material";
import { DrawerContext } from "assets/theme/drawer-provider";
import OffliButton from "components/offli-button";
import React from "react";
import { useParams } from "react-router-dom";
import { ActivityInviteDrawerContent } from "./activity-invite-drawer-content";
import HistoryIcon from "@mui/icons-material/History";

interface IActivityActionButtonsProps {
  isAlreadyParticipant?: boolean;
  isCreator?: boolean;
  onJoinClick?: () => void;
  areActionsLoading?: boolean;
  isPublic?: boolean;
  hasEnded?: boolean;
}

const ActivityActionButtons: React.FC<IActivityActionButtonsProps> = ({
  isAlreadyParticipant,
  isCreator,
  onJoinClick,
  areActionsLoading,
  isPublic,
  hasEnded,
}) => {
  const { id } = useParams();
  const { toggleDrawer } = React.useContext(DrawerContext);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        my: 2,
      }}
    >
      {isPublic && !hasEnded ? (
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
            onClick={() =>
              toggleDrawer({
                open: true,
                content: (
                  <ActivityInviteDrawerContent activityId={Number(id)} />
                ),
              })
            }
            startIcon={
              <EmailIcon
                sx={{
                  color: isAlreadyParticipant
                    ? "primary.main"
                    : "inactiveFont.main",
                }}
              />
            }
          >
            Invite
          </OffliButton>
        </>
      ) : null}
      {hasEnded ? (
        <OffliButton
          color="secondary"
          startIcon={<HistoryIcon sx={{ color: "primary.main" }} />}
          sx={{ width: "80%", color: "primary.main", fontWeight: "bold" }}
        >
          Activity has finished
        </OffliButton>
      ) : null}
    </Box>
  );
};

export default ActivityActionButtons;
