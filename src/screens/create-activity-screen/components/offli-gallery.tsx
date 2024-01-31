import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import { usePredefinedPictures } from 'hooks/use-predefined-pictures';
import * as React from 'react';

interface ITimePickerProps {
  onPictureSelect: (value: string) => void;
  tags?: string[];
}

const OffliGallery: React.FC<ITimePickerProps> = ({ tags, onPictureSelect }) => {
  const baseUrl = useGetApiUrl();
  const { data: { data: { pictures = [], count = 0 } = {} } = {}, isLoading } =
    usePredefinedPictures({ tags });
  return (
    <Box>
      {tags?.map((tag) => <Chip label={tag} key={tag} sx={{ mx: 1, my: 0.5 }} color="primary" />)}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 4
          }}>
          <CircularProgress color="primary" />
        </Box>
      ) : count > 0 ? (
        <Box
          sx={{
            display: 'grid',
            //   gridTemplateColumns:
            //     'repeat(auto-fit, minmax(min(100%/3, max(64px, 100%/5)), 1fr))',
            gridTemplateColumns: '1fr 1fr 1fr',
            my: 4
          }}>
          {pictures.map(({ name }) => (
            <Box
              sx={{
                maxWidth: '100%',
                m: 0.5,
                boxShadow: shadows[3]
              }}
              onClick={() => name && onPictureSelect(name)}
              key={`predefined_picture_${name}`}
              data-testid="offli-gallery-img-btn">
              <img src={`${baseUrl}/files/${name}`} style={{ maxWidth: '100%' }} alt="gallery" />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 2
          }}>
          <Typography sx={{ color: (theme) => theme?.palette?.text?.primary }}>
            There are no available pre-defined pictures
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OffliGallery;
