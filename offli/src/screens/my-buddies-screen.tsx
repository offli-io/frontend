import React from 'react'
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BuddyItem from '../components/buddy-item'
import logo from '../assets/img/profilePicture.jpg'

const data = [
  {
    name: 'Adam martin',
    imageSource: logo,
  },
  {
    name: 'lukas laskyplny',
    imageSource: logo,
  },
  {
    name: 'SkillerSWK',
    imageSource: logo,
  },
]

const MyBuddiesScreen = () => {
  return (
    <PageWrapper sxOverrides={{ px: 2 }}>
      <Box sx={{ mb: 2, width: '100%' }}>
        <TextField
          id="input-with-icon-textfield"
          placeholder="Search within my buddies"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <IconButton color="primary" sx={{ ml: 4 }}>
          <PersonAddIcon />
        </IconButton>
      </Box>
      {data?.map((buddy: any) => (
        <>
          <BuddyItem username={buddy?.name} imageSource={buddy?.imageSource} />
          <Divider
            variant="fullWidth"
            sx={{
              width: '100%',
              borderColor: theme => theme.palette.inactive.main,
            }}
          />
        </>
      ))}
    </PageWrapper>
  )
}

export default MyBuddiesScreen
