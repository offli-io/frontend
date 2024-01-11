import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import * as yup from 'yup';
import { checkIfUsernameAlreadyTaken, updateProfileInfo } from '../api/users/requests';
import { AuthenticationContext } from '../context/providers/authentication-provider';
import OffliButton from '../components/offli-button';
import { ApplicationLocations } from '../types/common/applications-locations.dto';
import { IUsername } from '../types/users/user.dto';

const schema: () => yup.SchemaOf<IUsername> = () =>
  yup.object({
    username: yup.string().defined().required('Please enter your username')
  });

interface IChooseUsernameValues {
  username?: string;
}
const ChooseUsernameGooglePage = () => {
  const navigate = useNavigate();
  const { userInfo } = React.useContext(AuthenticationContext);

  const { control, handleSubmit, setError, formState, watch } = useForm<IUsername>({
    defaultValues: {
      username: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const queryClient = useQueryClient();

  const [queryString] = useDebounce(watch('username'), 250);

  const { data: usernameAlreadyTaken } = useQuery<any>(
    ['username-taken', queryString],
    () => checkIfUsernameAlreadyTaken(queryString),
    {
      enabled: !!queryString
    }
  );

  const isUsernameInUse = Object.keys(formState?.errors)?.length !== 0;

  const { mutate: sendUpdateUsername, isLoading } = useMutation(
    ['update-username'],
    (values?: IChooseUsernameValues) => updateProfileInfo(userInfo?.id, values),
    {
      onSuccess: () => {
        toast.success('Username successfully updated');
        queryClient.invalidateQueries(['users', userInfo?.id]);
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Failed to update username');
      }
    }
  );

  const handleFormSubmit = React.useCallback((values: IChooseUsernameValues) => {
    sendUpdateUsername(values);
  }, []);

  React.useEffect(() => {
    if (usernameAlreadyTaken?.data) {
      setError('username', { message: 'Username already in use' });
    }
  }, [usernameAlreadyTaken]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ height: '100%' }}>
      {/* <OffliBackButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ alignSelf: "flex-start", m: 1 }}
      >
        Registration
      </OffliBackButton> */}
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Typography variant="h2" align="left" sx={{ width: '75%' }}>
          <Box sx={{ color: 'primary.main', width: '85%' }}>Choose&nbsp;</Box>
          your username
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              //label="Username"
              placeholder="Username"
              error={!!error}
              helperText={error?.message}
              sx={{ width: '80%', mt: 4, mb: 8 }}
            />
          )}
        />
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: '80%', mb: 5 }}
          disabled={isUsernameInUse}
          isLoading={isLoading}>
          Confirm
        </OffliButton>
      </Box>
    </form>
  );
};

export default ChooseUsernameGooglePage;
