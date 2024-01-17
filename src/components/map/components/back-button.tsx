import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import OffliButton from 'components/offli-button';
import { CustomizationContext } from 'context/providers/customization-provider';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

const BackButton = ({ onClick }: { onClick?: () => void }) => {
  const { theme } = React.useContext(CustomizationContext);
  return (
    <OffliButton
      sx={{
        position: 'absolute',
        bottom: 15,
        left: 20,
        zIndex: 400,
        fontSize: 20,
        color: 'primary.main',
        bgcolor: theme === ThemeOptionsEnumDto.LIGHT ? 'primary.light' : 'background.default'
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
