import React, { useState } from 'react'
import axios from 'axios'
import { Box, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import BackButton from '../components/back-button'
import OffliButton from '../components/offli-button'
import ReactInputVerificationCode from 'react-input-verification-code'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import {
  preCreateUser,
  verifyCodeAndRetrieveUserId,
} from '../api/users/requests'
import { useNavigate } from 'react-router-dom'

import qs from 'qs'
import { useSnackbar } from 'notistack'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { IEmailPassword } from '../types/users/user.dto'

const VerificationScreen = () => {
  const [verificationCode, setVerificationCode] = React.useState<string>('')
  const [userId, setUserId] = React.useState<string>('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { stateToken, setStateToken } = React.useContext(AuthenticationContext)

  const precreatedEmailPassword = queryClient.getQueryData<IEmailPassword>([
    'registration-email-password',
  ])

  // 1.preCreateUser /registration/presignup 200
  // 2.verifyCodeAndRetrieveUserId /registation/verify-email => 200 + userId
  // 3. keycloak registracia email username password --picovina, riesi BE

  const { data, mutate: verifyCodeMutate } = useMutation(
    ['user-id'],
    (code: string) =>
      verifyCodeAndRetrieveUserId({
        email: precreatedEmailPassword?.email,
        verificationCode: code,
      }),
    {
      onSuccess: data => {
        console.log(data?.data)
        //setUserId(data?.data?.userId)
        //setStateToken(data?.data?.)
        //setRefreshToken
        navigate(ApplicationLocations.WELCOME)
      },
      onError: error => {
        console.log(error)
      },
    }
  )

  const handleOnCompleted = (code: string) => {
    setVerificationCode(code)
    verifyCodeMutate(code)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //   justifyContent: 'center',
      }}
    >
      <BackButton href={ApplicationLocations.REGISTER} text="Sign Up" />
      <Typography variant="h2" sx={{ mt: 20, width: '75%' }} align="left">
        <Box sx={{ color: 'primary.main' }}>Confirm</Box>verification code
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ width: '75%', mt: 2, mb: 3 }}
      >
        Take a look for the verification code we just sent you to{' '}
        <b>{precreatedEmailPassword?.email}</b>.
      </Typography>
      <Typography variant="subtitle2" sx={{ ml: -25, mb: 1 }}>
        Confirmation code
      </Typography>
      <ReactInputVerificationCode
        autoFocus
        placeholder=""
        length={6}
        onCompleted={value => handleOnCompleted(value)}
      />
      <Box sx={{ display: 'flex', mr: -15, alignItems: 'center' }}>
        <Typography variant="subtitle2">No email?</Typography>
        <OffliButton variant="text">
          <Typography
            variant="subtitle2"
            sx={{ color: 'primary.main', ml: -1 }}
          >
            &nbsp;<b>Resend code</b>
          </Typography>
        </OffliButton>
      </Box>
    </Box>
  )
}

export default VerificationScreen
