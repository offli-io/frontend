import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import { resetPassword } from '../../../api/auth/requests';
import OffliButton from '../../../components/offli-button';

interface IResetPasswordFormProps {
  onSuccess: (email: string) => void;
}

export interface FormValues {
  email: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    email: yup.string().email().defined().required()
  });

const ResetPasswordForm: React.FC<IResetPasswordFormProps> = ({ onSuccess }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const { isLoading, mutate: sendResetPassword } = useMutation(
    ['reset-password'],
    (formValues: FormValues) => {
      return resetPassword(formValues);
    },
    {
      onSuccess: (data, params) => {
        toast.success('Verification code was sent to your email');
        onSuccess(params?.email);
      },
      onError: () => {
        toast.error('Failed to send verification code to given email');
      }
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => sendResetPassword(values),
    [sendResetPassword]
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
      <Box
        sx={{
          width: '100%',
          mb: 4
        }}>
        <Typography
          variant="h2"
          sx={{
            color: 'primary.main'
          }}>
          Reset
        </Typography>
        <Typography variant="h2">your password</Typography>
      </Box>
      <Typography sx={{ mb: 2 }}>
        We will send you verification code on your email, which will help us verify you.
      </Typography>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            // autoFocus
            {...field}
            data-testid="email-input"
            placeholder="Email"
            error={!!error}
            helperText={error?.message}
            sx={{ mb: 2, width: '100%' }}
          />
        )}
      />

      <OffliButton
        variant="contained"
        type="submit"
        sx={{ width: '50%', alignSelf: 'end' }}
        isLoading={isLoading}
        data-testid="reset-password-btn">
        Send
      </OffliButton>
    </form>
  );
};

export default ResetPasswordForm;
