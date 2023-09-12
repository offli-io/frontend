import LockIcon from "@mui/icons-material/Lock";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { IActivity } from "../types/activities/activity.dto";
import { format, getDay, getHours, getMonth, getTime } from "date-fns";
import { TIME_FORMAT } from "../utils/common-constants";
import { CustomizationContext } from "../assets/theme/customization-provider";
import { useGetApiUrl } from "../hooks/use-get-api-url";
import useLongPress from "hooks/use-long-press";
import OffliButton from "./offli-button";

interface IProps {
  activity?: IActivity;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
}

const ActivityCard: React.FC<IProps> = ({
  activity,
  onPress,
  onLongPress,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { shadows } = useTheme();
  const { mode } = React.useContext(CustomizationContext);
  const baseUrl = useGetApiUrl();
  const { action, handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity),
  });

  // React.useEffect(() => {
  //   if (action) {
  //     onLongPress?.(activity);
  //   }
  // }, [action, onLongPress]);

  const startDate = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;

  return (
    <OffliButton
      sx={{
        width: "96%",
        height: 200,
        marginTop: "2%",
        marginBottom: "2%",
        borderRadius: "10px",
        backgroundImage: `url(${baseUrl}/files/${activity?.title_picture})`,
        // backgroundImage: `url(${activity?.title_picture})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "flex-end",
        color: "white",
        boxShadow: shadows[4],
        p: 0,
      }}
      data-testid="activity-card"
      {...handlers}
      onClick={() => onPress?.(activity)}
      color="inherit"
      {...rest}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3% 3% 2% 3%",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          // this was before useing background gradient -> maybe use it for that if decided
          // backgroundColor: "rgba(0,0,0,.5)",
          // backdropFilter: "blur(0.7px)", // position: 'absolute',
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            color: "white",
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: "bold",
              lineHeight: 1,
              ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              ...(mode === "light"
                ? {
                    textShadow: ({ palette }) =>
                      `1px 1px 1px ${palette?.primary?.light}`,
                  }
                : {}),
            }}
          >
            {activity?.title}
          </Typography>
          {activity?.location?.name && (
            <Typography
              sx={{
                lineHeight: 1,
                fontSize: 12,
                fontWeight: "bold",
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
                my: 0.5,
              }}
            >
              {activity?.location?.name}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              mt: 0.4,
            }}
          >
            <LockIcon
              sx={{
                fontSize: 14,
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              }}
            />
            <PeopleAltIcon
              sx={{
                fontSize: 14,
                ml: 1,
                mr: 0.5,
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              }}
            />
            {activity?.limit ? (
              <Typography
                sx={{
                  fontSize: 16,
                  // fontWeight: "bold",
                  lineHeight: 1,
                  ...(mode === "light" ? { filter: "invert(100%)" } : {}),
                }}
              >
                {activity?.count_confirmed}/{activity?.limit}{" "}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: 16,
                  // fontWeight: "bold",
                  lineHeight: 1,
                  ...(mode === "light" ? { filter: "invert(100%)" } : {}),
                }}
              >
                {activity?.count_confirmed} 0
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 22,
                lineHeight: 1,
                fontWeight: "bold",
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              }}
            >
              {startDate ? getDay(startDate) : "-"}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                lineHeight: 1,
                fontSize: 12,
                letterSpacing: 0,
                fontWeight: "bold",
                my: 0.5,
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              }}
            >
              {startDate ? format(startDate, "MMMM") : "-"}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 22,
                lineHeight: 1,
                fontWeight: "semi-bold",
                ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              }}
            >
              {startDate ? format(startDate, TIME_FORMAT) : "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </OffliButton>
  );
};

export default ActivityCard;
