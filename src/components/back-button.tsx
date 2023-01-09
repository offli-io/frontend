import React from 'react'
import { Button, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export interface IBackButtonProps {
  href: string
  text: string
}

const BackButton: React.FC<IBackButtonProps> = ({ href, text }) => {
  return (
    <Button
      sx={{ position: 'absolute', top: 40, left: 15, textTransform: 'none' }}
      href={href}
    >
      <ArrowBackIosNewIcon sx={{ height: '20px' }} />
      <Typography variant="subtitle2" sx={{ color: 'black', fontSize: 16 }}>
        {text}
      </Typography>
    </Button>
  )
}

export default BackButton
