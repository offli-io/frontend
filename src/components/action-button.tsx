import React from 'react';

import { Button, ButtonProps, CircularProgress, SxProps, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CustomizationContext } from 'context/providers/customization-provider';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

interface IProps extends ButtonProps {
  type?: 'button' | 'reset' | 'submit' | undefined;
  text: string;
  sx?: SxProps;
  onClick?: () => void;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const ActionButton: React.FC<IProps> = ({
  type,
  text,
  sx,
  onClick,
  href,
  isLoading,
  disabled,
  ...rest
}) => {
  const { theme } = React.useContext(CustomizationContext);

  return (
    <Button
      variant="contained"
      sx={{
        ...sx,
        width: '60%',
        borderRadius: '15px',
        backgroundColor: ({ palette }) =>
          theme === ThemeOptionsEnumDto.LIGHT ? palette.primary.light : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2%'
      }}
      type={type}
      onClick={onClick}
      data-testid="action-button"
      disabled={isLoading || disabled}
      {...rest}>
      {isLoading ? <CircularProgress size={20} color="primary" sx={{ mr: 1.5 }} /> : null}
      {href ? (
        <Link to={href!} style={{ textDecoration: 'none' }}>
          <Typography
            variant="h5"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold'
            }}>
            {text}
          </Typography>
        </Link>
      ) : (
        <Typography
          variant="h5"
          sx={{
            color: theme === ThemeOptionsEnumDto.LIGHT ? 'primary.main' : undefined,
            fontWeight: 'bold'
          }}>
          {text}
        </Typography>
      )}
    </Button>
  );
};

export default ActionButton;
