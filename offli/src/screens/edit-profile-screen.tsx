import React from 'react'
import { Box, IconButton, Typography, Grid, Button } from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import { useQueryClient } from '@tanstack/react-query'
import BackHeader from '../components/back-header'
import { IPersonExtended } from '../types/activities/activity.dto'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { AuthenticationContext } from '../assets/theme/authentication-provider'

const EditProfileScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext)
  const queryClient = useQueryClient()

  const data = queryClient.getQueryData<{ data: IPersonExtended }>([
    'user-info',
    userInfo?.username,
  ])

  const saveChanges = () => {
    console.log('Haah kokotko si sa nechal napalit')
  }

  return (
    <>
      <BackHeader
        title="Edit profile"
        sx={{ mb: 2 }}
        to={ApplicationLocations.PROFILE}
      />
      <PageWrapper>
        <Box
          sx={{
            // mt: (HEADER_HEIGHT + 16) / 12,
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          {/* <Box
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
          </Box> */}
        </Box>
        <img
          // todo add default picture in case of missing photo
          src={data?.data?.profile_photo_url}
          alt="profile picture"
          style={{
            height: '70px',
            width: '70px',
            borderRadius: '50%',
            // border: '2px solid primary.main', //nejde pica
            border: '2px solid black',
          }}
        />
        <Grid
          container
          rowSpacing={1.5}
          sx={{ width: '80%', mt: 3, fontSize: 5 }}
        >
          <Grid item xs={5}>
            <Typography variant="h5">Name</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h6">{data?.data?.name}</Typography>
          </Grid>
          {/* <Grid item xs={5}>
            <Typography variant="h5">Username</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h6">{data?.data?.username}</Typography>
          </Grid> */}
          <Grid item xs={5} sx={{ mt: 1 }}>
            <Typography variant="h5">About me</Typography>
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
            <Typography variant="h6">{data?.data?.username}</Typography>
          </Grid>
        </Grid>
        <Button
          style={{
            width: '60%',
            borderRadius: '15px',
            backgroundColor: '#E4E3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2%',
            marginTop: '12%',
          }}
          onClick={saveChanges}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Save
          </Typography>
        </Button>
      </PageWrapper>
    </>
  )
}

export default EditProfileScreen
