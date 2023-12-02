import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Rating,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useTheme,
} from "@mui/material";
import OffliButton from "components/offli-button";
import React from "react";
import connectInstagramPhoto from "../../../assets/img/connect-instagram.svg";
import { IActivity, IPerson } from "types/activities/activity.dto";
import { useGetApiUrl } from "hooks/use-get-api-url";

const theme = createTheme({
  components: {
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: "primary",
        },
      },
    },
  },
});

export interface IFeedbackDrawerProps {
  creator?: IPerson;
  activity?: IActivity;
  onFeedbackButtonClick?: (value: number | null) => void;
}

const FeedbackDrawer: React.FC<IFeedbackDrawerProps> = ({
  creator,
  activity,
  onFeedbackButtonClick,
}) => {
  const baseUrl = useGetApiUrl();
  const { shadows } = useTheme();
  const [feedbackValue, setFeedbackValue] = React.useState<number | null>(0);

  //   console.log(creator, activity);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        {`How would you rate ${creator?.username} as a creator of the activity?`}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          aspectRatio: 1,
          marginLeft: "-1rem",
          margin: 5,
        }}
      >
        <img
          src={`${baseUrl}/files/${creator?.profile_photo}`}
          alt="activity_title_picture"
          style={{
            height: 50,
            aspectRatio: 1,
            borderRadius: "50%",
            marginRight: "-25px",
            objectFit: "contain",
            zIndex: 10,
          }}
        />
        <img
          src={`${baseUrl}/files/${activity?.title_picture}`}
          alt="activity_title_picture"
          style={{
            height: 190,
            aspectRatio: 1,
            borderRadius: "10px",
            margin: 5,
            objectFit: "contain",
            boxShadow: shadows[4],
          }}
        />
      </div>
      <Typography
        variant="h1"
        align="center"
        sx={{ mb: 2, color: ({ palette }) => palette.primary.main }}
      >
        {activity?.title}
      </Typography>
      <ThemeProvider theme={theme}>
        <Rating
          name="feedback"
          defaultValue={2}
          size="large"
          value={feedbackValue}
          onChange={(event, newValue) => {
            setFeedbackValue(newValue);
          }}
        />
      </ThemeProvider>
      <OffliButton
        sx={{ width: "70%", mt: 4 }}
        onClick={() => onFeedbackButtonClick?.(feedbackValue)}
      >
        Leave Feedback
      </OffliButton>
    </Box>
  );
};

export default FeedbackDrawer;
