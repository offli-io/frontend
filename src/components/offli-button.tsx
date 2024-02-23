import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import React from 'react';

interface IOffliButtonProps extends LoadingButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactElement | string;
  type?: 'submit' | 'button' | 'reset';
  to?: string;
}

const OffliButton: React.FC<IOffliButtonProps> = ({
  children,
  disabled,
  onClick,
  type,
  to,
  isLoading,
  ...rest
}) => {
  return (
    <LoadingButton
      disabled={disabled}
      loading={isLoading}
      onClick={onClick}
      variant="contained"
      type={type}
      href={to}
      {...rest}>
      {children}
    </LoadingButton>
  );
};

export default OffliButton;
