import { IconButton, Box, Menu, MenuItem, Typography } from '@mui/material'
import Fade from '@mui/material/Fade'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import React from 'react'
import StarIcon from '@mui/icons-material/Star'
import PersonOffIcon from '@mui/icons-material/PersonOff'

export const BuddyActionContent: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose} sx={{ px: 2 }} divider>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton onClick={handleClick} sx={{ mr: 0.5, pl: 0 }}>
              <StarIcon color="primary" />
            </IconButton>
            <Typography>Promote to leader</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleClick} sx={{ mr: 0.5, pl: 0 }}>
              <PersonOffIcon color="error" />
            </IconButton>
            <Typography>Kick from activity</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  )
}
