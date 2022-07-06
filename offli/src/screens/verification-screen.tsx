import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import BackButton from '../components/back-button'
import ReactInputVerificationCode from 'react-input-verification-code'

const VerificationScreen = () => {
  const [emailAddress] = useState('amy@gmail.com')

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
      className="backgroundImage"
    >
      <BackButton href="/register" text="Sign Up" />
      <Typography
        variant="h3"
        sx={{ mt: 20, fontWeight: 'bold', fontSize: '24px' }}
      >
        Confirm verification code
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ width: '75%', mt: 2, mb: 3 }}
      >
        Take a look for the verification code we just sent you to{' '}
        <b>{emailAddress}</b>.
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: 'lightgrey', ml: -22, mb: 1 }}
      >
        Confirmation code
      </Typography>
      <ReactInputVerificationCode autoFocus placeholder="" length={5} />
      <Box sx={{ mt: 1, display: 'flex', mr: -15 }}>
        <Typography variant="subtitle2">No email?</Typography>
        <Typography variant="subtitle2" sx={{ color: 'lightgrey' }}>
          &nbsp;<b>Resend code</b>
        </Typography>
      </Box>
    </Box>
  )
}

export default VerificationScreen
