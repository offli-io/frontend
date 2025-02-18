import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import OffliButton from 'components/offli-button';
import { useMap } from 'react-leaflet';

const SaveButton = ({
  onClick,
  isLoading
}: {
  onClick?: (location: L.LatLng) => void;
  isLoading?: boolean;
}) => {
  const map = useMap();
  return (
    <OffliButton
      sx={{
        position: 'absolute',
        bottom: 15,
        right: 20,
        zIndex: 400,
        fontSize: 20,
        width: '45%',
        bgcolor: ({ palette }) => palette?.primary?.main,
        color: ({ palette }) => palette?.background?.default,
        borderRadius: '15px'
      }}
      data-testid="save-button"
      onClick={() => onClick?.(map.getCenter())}
      startIcon={<WhereToVoteIcon sx={{ color: 'background.default' }} />}
      isLoading={isLoading}>
      Use location
    </OffliButton>
  );
};

export default SaveButton;
