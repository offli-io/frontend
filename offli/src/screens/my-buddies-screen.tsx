import React from 'react'
import { InputAdornment, TextField } from '@mui/material'
import { PageWrapper } from '../components/page-wrapper'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MyBuddiesScreen = () => {
  return (
    <PageWrapper>
      <TextField
        id="input-with-icon-textfield"
        placeholder="Search within buddies"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
    </PageWrapper>
  )
}

export default MyBuddiesScreen
