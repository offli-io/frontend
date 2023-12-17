import { Box, Button, Checkbox, Typography } from '@mui/material';
import React from 'react';

interface ILabeledDividerProps {
  imageSource?: string;
  onClick?: (id: number, checked?: boolean) => void;
  username?: string;
  checkbox?: boolean;
  id: number;
  children?: React.ReactElement;
}

const BuddyItemCheckbox: React.FC<ILabeledDividerProps> = ({
  username,
  checkbox,
  id,
  onClick,
  ...rest
}) => {
  const [checked, setChecked] = React.useState(false);

  const handleClick = React.useCallback(
    (checked: boolean) => {
      checkbox && setChecked((prevState) => !prevState);
      onClick && onClick(id, !checked);
    },
    [onClick, setChecked, id]
  );

  return (
    <Button
      onClick={() => handleClick(checked)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
        py: 2,
        textTransform: 'none',
        width: '100%'
      }}
      {...rest}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <StyledImage src={imageSource ?? logo} alt="profile picture" /> */}
        <Typography sx={{ ml: 4, color: 'black' }}>{username}</Typography>
      </Box>
      {checkbox && <Checkbox checked={checked} />}
    </Button>
  );
};
export default BuddyItemCheckbox;
