import React from 'react'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BuddyItem from '../components/buddy-item'

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
      <BuddyItem username="Adam.martin" />
    </PageWrapper>
  )
}

export default MyBuddiesScreen
