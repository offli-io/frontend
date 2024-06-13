import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import createActivityImg from '../../../assets/img/create-activity.svg';
import OffliButton from '../../../components/offli-button';
import OffliTextField from '../../../components/offli-text-field';
import { FormValues } from '../utils/validation-schema';
import AnimationDiv from '../../../components/animation-div';

interface INameFormProps {
  onNextClicked: () => void;
  methods: UseFormReturn<FormValues, object>;
}

export const NameForm: React.FC<INameFormProps> = ({ onNextClicked, methods }) => {
  const { control, formState, watch } = methods;
  const { palette } = useTheme();

  const errors = React.useMemo(() => formState.errors, [formState]);
  const isFormValid = Object.keys(errors)?.length === 0 && (watch('title') ?? '')?.length > 0;

  return (
    <AnimationDiv style={{ width: '100%' }}>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            width: '55%'
          }}>
          <Typography variant="h1" sx={{ color: 'primary.main' }}>
            Create
          </Typography>
          <Typography variant="h1" sx={{ color: palette.text.primary }}>
            new activity
          </Typography>
        </Box>
        <Box sx={{ width: '45%', display: 'flex', justifyContent: 'center' }}>
          <img src={createActivityImg} style={{ height: 120 }} alt="Name form" />
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <OffliTextField
              {...field}
              error={!!error}
              sx={{ width: '100%' }}
              label="Activity name"
              placeholder="Type activity name"
              helperText={!!error && 'Activity name is required'}
              autoCapitalize="sentences"
              data-testid="activity-name-input"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2
        }}>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%', height: 50 }}
          //TODO some bug isValid returning false when name is
          disabled={!isFormValid}
          data-testid="next-btn">
          Next
        </OffliButton>
      </Box>
    </AnimationDiv>
  );
};
