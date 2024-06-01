import { OutlinedTextFieldProps, TextField } from '@mui/material';
import React from 'react';

interface IOffliTextFieldProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | string;
}

const OffliTextField: React.FC<IOffliTextFieldProps> = ({
  autoCapitalize = 'off',
  ...textFieldProps
}) => {
  return (
    <TextField
      inputProps={{
        ...textFieldProps?.inputProps,
        autoCapitalize
      }}
      {...textFieldProps}
    />
  );
};

export default OffliTextField;
