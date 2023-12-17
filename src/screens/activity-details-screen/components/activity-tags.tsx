import { Chip, SxProps } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

interface IProps {
  tags?: string[];
  sx?: SxProps;
}

const ActivityTags: React.FC<IProps> = ({ tags, sx }) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleChipClick = React.useCallback(
    (tag: string) => {
      if (selected?.includes(tag)) {
        setSelected((selected) => selected?.filter((_tag) => _tag !== tag));
      } else {
        setSelected((selected) => [tag, ...selected]);
      }
    },
    [selected]
  );
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        ...sx
        // overflowWrap: "wrap",
      }}>
      {tags?.map((tag, index) => (
        <Chip
          label={tag}
          variant={selected?.includes(tag) ? 'filled' : 'outlined'}
          key={index}
          sx={{
            p: 2,
            my: 1,
            borderRadius: '10px',
            borderWidth: '2px',
            border: 'solid primary',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
          color="primary"
          onClick={() => handleChipClick(tag)}
        />
      ))}
    </Box>
  );
};

export default ActivityTags;
