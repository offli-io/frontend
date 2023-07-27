import LockIcon from "@mui/icons-material/Lock";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import useLongPress from "../hooks/use-long-press";
import { IActivity } from "../types/activities/activity.dto";
import { format, getDay, getHours, getMonth, getTime } from "date-fns";
import { TIME_FORMAT } from "../utils/common-constants";

interface IProps {
  activity?: IActivity;
  onPress: (activity?: IActivity) => void;
}

const ActivityCard: React.FC<IProps> = ({ activity, onPress, ...rest }) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress();
  const { shadows } = useTheme();

  const startDate = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;

  return (
    <Box
      sx={{
        width: "96%",
        height: 200,
        marginTop: "2%",
        marginBottom: "2%",
        borderRadius: "10px",
        backgroundImage: `url(${activity?.title_picture_url})`,
        // backgroundImage: `url(${activity?.title_picture})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "flex-end",
        color: "white",
        boxShadow: shadows[4],
      }}
      onClick={() => onPress(activity)}
      data-testid="activity-card"
      // {...handlers}
      // onTouchStart={() => {
      //   const timer = setTimeout(() => onLongPress(), 500);
      // }}
      // onTouchEnd={() => clearTimeout(timer)}
      {...rest}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgba(0,0,0,.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3% 3% 2% 3%",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          backdropFilter: "blur(0.7px)", // position: 'absolute',
          // bottom: 0,
        }}
      >
        <Box
          sx={{
            maxWidth: 250,
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
              color: ({ palette }) => palette?.text?.primary,
              filter: "invert(100%)",
              textShadow: ({ palette }) =>
                `1px 1px 1px ${palette?.primary?.light}`,
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
                color: ({ palette }) => palette?.text?.primary,
                filter: "invert(100%)",
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
                color: ({ palette }) => palette?.text?.primary,
                filter: "invert(100%)",
              }}
            />
            <PeopleAltIcon
              sx={{
                fontSize: 14,
                ml: 1,
                mr: 0.5,
                color: ({ palette }) => palette?.text?.primary,
                filter: "invert(100%)",
              }}
            />
            {activity?.limit ? (
              <Typography
                sx={{
                  fontSize: 16,
                  // fontWeight: "bold",
                  lineHeight: 1,
                  color: ({ palette }) => palette?.text?.primary,
                  filter: "invert(100%)",
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
                  color: ({ palette }) => palette?.text?.primary,
                  filter: "invert(100%)",
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
                color: ({ palette }) => palette?.text?.primary,

                filter: "invert(100%)",
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
                color: ({ palette }) => palette?.text?.primary,
                filter: "invert(100%)",
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
                color: ({ palette }) => palette?.text?.primary,
                filter: "invert(100%)",
              }}
            >
              {startDate ? format(startDate, TIME_FORMAT) : "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ActivityCard;
