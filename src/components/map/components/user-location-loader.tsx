import { CircularProgress, Typography } from '@mui/material';
import OffliButton from 'components/offli-button';

const UserLocationLoader = ({ isLoading }: { isLoading?: boolean }) => {
  return isLoading ? (
    <OffliButton
      sx={{
        position: 'absolute',
        bottom: '-2%',
        left: '30%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5000,
        bgcolor: 'primary.light',
        display: 'flex',
        py: 2,
        fontSize: 16
      }}
      size="large">
      <>
        <CircularProgress size={16} sx={{ mr: 2 }} />
        <Typography sx={{ fontSize: 12 }}>{`Loading current location`}</Typography>
      </>
    </OffliButton>
  ) : null;
};

export default UserLocationLoader;
