import React from 'react'
import { Box, Grid } from '@mui/material'
import ProfilePicture from '../assets/img/profilePicture.jpg'

const ProfileGallery: React.FC = () => {
  const arr = [0, 1, 2, 3]
  return (
    <Box>
      <Grid
        container
        rowSpacing={0.1}
        columnSpacing={0.1}
        sx={{ width: '90%', margin: 'auto' }}
      >
        {arr.map(a => {
          return (
            <Grid item xs={6} key={a}>
              <img
                src={ProfilePicture}
                alt="profile picture"
                style={{
                  height: '38vw',
                  borderRadius: 12,
                }}
              />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ProfileGallery
