import OffliButton from "components/offli-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMediaQuery, useTheme } from "@mui/material";

const BackButton = ({ onClick }: { onClick?: () => void }) => {
  const { breakpoints } = useTheme();
  const upMd = useMediaQuery(breakpoints.up("md"));

  return (
    <OffliButton
      sx={{
        position: "absolute",
        bottom: 15,
        left: 20,
        zIndex: 400,
        fontSize: 20,
        color: "primary.main",
        bgcolor: "primary.light",
        // width: "45%",
      }}
      onClick={() => onClick?.()}
      startIcon={
        <ArrowBackIosNewIcon sx={{ color: ({ palette }) => "inherit" }} />
      }
      // variant="text"
    >
      Back
    </OffliButton>
  );
};

export default BackButton;
