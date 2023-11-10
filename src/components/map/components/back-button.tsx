import OffliButton from "components/offli-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const BackButton = ({ onClick }: { onClick?: () => void }) => {
    return (
      <OffliButton
        sx={{
          position: "fixed",
          bottom: 65,
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