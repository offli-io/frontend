import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import BackButton from '../components/back-button'
import OffliButton from '../components/offli-button'
import ReactInputVerificationCode from 'react-input-verification-code'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { verifyCodeAndRetrieveUserId } from '../api/users/requests'
import { useNavigate } from 'react-router-dom'

const VerificationScreen = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const userEmail = queryClient.getQueryData<string>(['pre-created-user-email'])

  const { data, mutate } = useMutation(
    ['user-id'],
    (code: string) =>
      verifyCodeAndRetrieveUserId({ email: userEmail, verificationCode: code }),
    {
      onSuccess: data => {
        console.log(data?.data)
        navigate(ApplicationLocations.PICK_USERNAME)
      },
      onError: error => {
        console.log(error)
      },
    }
  )

  const handleOnCompleted = (code: string) => {
    mutate(code)
    console.log(data?.data.response)
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
      <Typography variant="h2" sx={{ mt: 20 }}>
        Confirm verification code
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ width: '75%', mt: 2, mb: 3 }}
      >
        Take a look for the verification code we just sent you to{' '}
        <b>{userEmail}</b>.
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
