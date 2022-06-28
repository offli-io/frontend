import React from 'react'
import { Box, TextField } from '@mui/material'
//import loadingImage from '../assets/img/loadingImg.jpg'
import Logo from '../components/logo'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

//const logo = require('../assets/img/logoPurple.png')

// interface ILoginScreenProps {}
export interface FormValues {
  method: string
  value: string
  otp: string
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    method: yup.string().defined().required(),
    value: yup.string().defined().required(),
    otp: yup.string().defined().required(),
  })

const LoginScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      method: '',
      value: '',
      otp: '',
    },
    resolver: yupResolver(schema()),
    mode: 'onChange',
  })

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  )

  return (
    <Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Logo />
        <Controller
          name="value"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              //label={t(`value.${nextStep?.authenticationType}.label`)}
              // placeholder={
              //   findByLanguageAlternative(
              //     nextStep?.data?.options?.[0]?.placeHolderLocalizationList ?? [],
              //     locale
              //   )?.text
              // }
              variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
            />
          )}
        />
      </form>
    </Box>
  )
}

export default LoginScreen
