import {
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import OffliButton from "components/offli-button";

const UserLocationLoader = ({ isLoading }: { isLoading?: boolean }) => {
  const { breakpoints } = useTheme();
  const upMd = useMediaQuery(breakpoints.up("md"));

  return true ? (
    <OffliButton
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 5000,
        bgcolor: "primary.light",
        width: "75%",
        display: "flex",
        py: 2,
      }}
      size="large"
    >
      <>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>User's location is loading</Typography>
      </>
    </OffliButton>
  ) : null;
};

export default UserLocationLoader;
