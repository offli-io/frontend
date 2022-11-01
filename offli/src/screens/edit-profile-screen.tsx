import React from 'react'
import { Link } from 'react-router-dom'
import { Box, IconButton, Typography, Grid } from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import CloseIcon from '@mui/icons-material/Close'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import { HEADER_HEIGHT } from '../utils/common-constants'

const EditProfileScreen = () => {
  return (
    <PageWrapper>
      <Box
        sx={{
          // mt: (HEADER_HEIGHT + 16) / 12,
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '65%',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/profile">
            <IconButton color="primary" sx={{ padding: 0, ml: 3 }}>
              <CloseIcon sx={{ padding: 0 }} />
            </IconButton>
          </Link>
          <Typography align="left" variant="h3">
            Edit profile
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100px',
          height: '100px',
          backgroundColor: '#DADADA',
          mt: 5,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <IconButton color="primary" sx={{ padding: 0 }}>
          <AddOutlinedIcon sx={{ padding: 0 }} />
        </IconButton>
      </Box>
      <Grid container rowSpacing={1.5} sx={{ width: '80%', mt: 3 }}>
        <Grid item xs={5}>
          <Typography variant="h5">Name</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="h6">Emma Smith</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h5">Username</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="h6">emma.smith</Typography>
        </Grid>
        <Grid item xs={5} sx={{ mt: 1 }}>
          <Typography variant="h5">About Me</Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 1 }}>
          <Typography variant="h6">Type something about you</Typography>
        </Grid>
        <Grid item xs={5} sx={{ mt: 1 }}>
          <Typography variant="h5">Location</Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 1 }}>
          <Typography variant="h6">Bratislava</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h5">Birthdate</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="h6">01.01.1999</Typography>
        </Grid>
        <Grid item xs={5} sx={{ mt: 1 }}>
          <Typography variant="h5">Instagram Username</Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 1 }}>
          <Typography variant="h6">@emma.smith</Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default EditProfileScreen
