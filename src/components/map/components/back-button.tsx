import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import OffliButton from 'components/offli-button';

const BackButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <OffliButton
      sx={{
        position: 'absolute',
        bottom: 15,
        left: 20,
        zIndex: 400,
        fontSize: 20,
        color: 'primary.main',
        bgcolor: 'primary.light'
        // width: "45%",
      }}
      onClick={() => onClick?.()}
      startIcon={<ArrowBackIosNewIcon sx={{ color: 'inherit' }} />}
      // variant="text"
    >
      Back
    </OffliButton>
  );
};

export default BackButton;
