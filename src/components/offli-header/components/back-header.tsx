import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, IconButton, SxProps, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import {
  HeaderContext,
  HeaderProvider,
} from "../../../app/providers/header-provider";

interface IBackHeaderProps {
  title?: string;
  sx?: SxProps;
  to?: string;
  //   headerRightContent?: React.ReactElement;
}

const BackHeader: React.FC<IBackHeaderProps> = ({
  title,
  sx,
  to,
  //   headerRightContent,
}) => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { headerRightContent, setHeaderRightContent } =
    React.useContext(HeaderContext);
  const toParsed = to?.split("/");
  //why was this done?
  //BIG TODO
  const fromLocation = toParsed && `/${toParsed[toParsed?.length - 1]}`;

  const handleBackNavigation = React.useCallback(() => {
    if (!to) {
      return;
    }
    // edge cases when there is double navigation via header (e.g. BUDDIES -> ADD_BUDDY screens)
    if (
      to === ApplicationLocations.ACTIVITY_DETAIL &&
      location.startsWith(ApplicationLocations.MAP)
    ) {
      return navigate(to, {
        state: {
          from: ApplicationLocations.ACTIVITIES,
        },
      });
    }

    if (
      to.startsWith(ApplicationLocations.ACTIVITY_MEMBERS) &&
      location.startsWith(ApplicationLocations.USER_PROFILE)
    ) {
      return navigate(to, {
        state: {
          from: ApplicationLocations.ACTIVITIES,
        },
      });
    }
    if (location.startsWith(ApplicationLocations.ACTIVITY_DETAIL)) {
      return navigate(ApplicationLocations.ACTIVITIES);
    }
    if (location.startsWith(ApplicationLocations.BUDDIES)) {
      return navigate(ApplicationLocations.PROFILE);
    }
    //idk if this state passing is ok
    // I dont want to always loop between 2 back routes
    navigate(to, {
      state: {
        from: location,
      },
    });
  }, [fromLocation, location, navigate]);

  React.useEffect(() => {
    return () => setHeaderRightContent(null);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        // borderBottom: '1px solid lightgrey',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        pt: 1,
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      {fromLocation && (
        <IconButton
          onClick={handleBackNavigation}
          color="primary"
          sx={{
            flex: 1,
            position: "absolute",
            left: 0,
            textTransform: "none",
          }}
        >
          <ArrowBackIosNewIcon sx={{ color: "primary.main" }} />
        </IconButton>
      )}
      <Box>
        <Typography
          variant="h4"
          sx={{ color: ({ palette }) => palette?.text.primary }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ position: "absolute", right: 0 }}>{headerRightContent}</Box>
    </Box>
  );
};

export default BackHeader;
