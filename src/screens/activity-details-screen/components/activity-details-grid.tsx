import React from "react";
import { Box, Card, Grid, IconButton, Typography, styled } from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RoomIcon from "@mui/icons-material/Room";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IActivity } from "../../../types/activities/activity.dto";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../../../types/common/customized-location-state.dto";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "../../../utils/common-constants";
import OffliButton from "../../../components/offli-button";
import { useMutation } from "@tanstack/react-query";
import { addActivityToCalendar } from "../../../api/activities/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { useSnackbar } from "notistack";

export enum IGridAction {
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR",
}

interface IProps {
  activity?: IActivity;
  onActionClick?: (action: IGridAction) => void;
}

const StyledBox = styled(Card)(() => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  borderRadius: "10px",
  // backgroundColor: "#E4E3FF",
  paddingTop: "4%",
  paddingBottom: "2%",
  marginBottom: "16px",
  // maxWidth: "45vw",
}));

const StyledText = styled(Typography)(() => ({
  display: "block",
  width: "90%",
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  overflow: "hidden",
  maxHeight: "1.4rem",
  lineHeight: "1.4rem",
  // fontWeight: "bold",
}));

const ActivityDetailsGrid: React.FC<IProps> = ({ activity, onActionClick }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { enqueueSnackbar } = useSnackbar();

  // const from = (location?.state as ICustomizedLocationStateDto)?.from;

  const handleShowOnMap = () => {
    navigate(`${ApplicationLocations.MAP}/${activity?.id}`, {
      state: {
        from: `${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoFlow: "row",
        rowGap: 0.5,
        columnGap: 2,
        ml: 0.2,
        mt: 5,
      }}
    >
      <StyledBox>
        <IconButton color="primary" sx={{ p: 0 }}>
          <PeopleAltIcon sx={{ fontSize: 26, color: "primary.main" }} />
        </IconButton>
        <OffliButton
          onClick={() =>
            navigate(
              `${ApplicationLocations.ACTIVITY_MEMBERS}/${activity?.id}`,
              {
                state: {
                  from: pathname,
                },
              }
            )
          }
          variant="text"
          size="small"
          sx={{
            textDecoration: "none",
            fontSize: 15,
            mt: 0.5,
            // fontWeight: "500",
          }}
        >
          Show participants
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.count_confirmed}/{activity?.limit}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary" sx={{ p: 0 }}>
          <CalendarTodayIcon sx={{ fontSize: 26, color: "primary.main" }} />
        </IconButton>

        <OffliButton
          onClick={() => onActionClick?.(IGridAction.GOOGLE_CALENDAR)}
          variant="text"
          size="small"
          sx={{
            textDecoration: "none",
            fontSize: 15,
            mt: 0.5,
            // fontWeight: "700",
          }}
          // endIcon={<CalendarTodayIcon />}
        >
          Add to calendar
        </OffliButton>

        <StyledText align="center" variant="subtitle1">
          {activity?.datetime_from
            ? format(new Date(activity?.datetime_from), DATE_TIME_FORMAT)
            : "-"}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary" sx={{ p: 0 }}>
          <RoomIcon sx={{ fontSize: 26, color: "primary.main" }} />
        </IconButton>
        {/* <Typography variant="h5" sx={{ mb: 1 }}>
          Where?
        </Typography> */}
        <OffliButton
          onClick={() =>
            navigate(`${ApplicationLocations.MAP}/${activity?.id}`, {
              state: {
                from: pathname,
              },
            })
          }
          // endIcon={<RoomIcon sx={{ fontSize: 26 }} />}
          size="small"
          variant="text"
          sx={{
            textDecoration: "none",
            fontSize: 15,
            mt: 0.5,
            // fontWeight: "400",
          }}
        >
          Show on map
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.location?.name}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary" sx={{ p: 0 }}>
          <MonetizationOnIcon sx={{ fontSize: 26, color: "primary.main" }} />
        </IconButton>
        <OffliButton
          onClick={() => console.log("show on map")}
          variant="text"
          size="small"
          sx={{
            textDecoration: "none",
            fontSize: 15,
            mt: 0.5,
            // fontWeight: "bold",
          }}
        >
          Initial price
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.price ?? "-"}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailsGrid;
