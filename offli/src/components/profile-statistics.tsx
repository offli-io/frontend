import React from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

interface IProps {
  participatedNum?: number
  enjoyedNum?: number
  createdNum?: number
  metNum?: number
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  enjoyedNum,
  createdNum,
  metNum,
}) => {
  return (
    <Grid
      container
      rowSpacing={1}
      sx={{
        width: '100%',
        borderRadius: '15px',
        backgroundColor: '#E4E3FF',
        paddingBottom: '5%',
        marginTop: '1%',
      }}
    >
      {participatedNum && (
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // padding: '5%',
            }}
          >
            <IconButton color="primary">
              <OfflineBoltIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ lineHeight: 1.2 }}
            >
              You participated in <br /> <b>{participatedNum} activities!</b>
            </Typography>
          </Box>
        </Grid>
      )}
      {enjoyedNum && (
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // padding: '5%',
            }}
          >
            <IconButton color="primary">
              <FavoriteIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ lineHeight: 1.2 }}
            >
              <b>{enjoyedNum} times</b> enjoyed <br /> time together!
            </Typography>
          </Box>
        </Grid>
      )}
      {createdNum && (
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // padding: '5%',
            }}
          >
            <IconButton color="primary" sx={{ padding: '2%' }}>
              <AddRoundedIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ lineHeight: 1.2 }}
            >
              You created <br />
              <b>{createdNum} activities.</b>
            </Typography>
          </Box>
        </Grid>
      )}
      {metNum && (
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // padding: '5%',
            }}
          >
            <IconButton color="primary">
              <PeopleAltIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ lineHeight: 1.2 }}
            >
              You`ve met <br />
              <b>{metNum} new buddies!</b>
            </Typography>
          </Box>
        </Grid>
      )}
      {/* <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <PeopleOutlinedIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You've met <b>12 new buddies!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <SportsBarIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You participated in <b>10 activities!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <AddOutlinedIcon sx={{ fontSize: 25 }} />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You created <b>5 activities!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              <b>9 times </b>enjoyed good time together!
            </Typography>
          </Box> */}
    </Grid>
  )
}

export default ProfileStatistics
