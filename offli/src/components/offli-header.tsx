import React, { useState } from 'react'
import { Box, IconButton, Badge, AppBar, SxProps } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'

import { ApplicationLocations } from '../types/common/applications-locations.dto'
import offliLogo from '../assets/img/logoPurple.png'
import { HEADER_HEIGHT } from '../utils/common-constants'

interface IProps {
  sx?: SxProps
}

const OffliHeader: React.FC<IProps> = ({ sx }) => {
  const location = useLocation().pathname
  const [notificationNumber] = useState(5)

  //TODO add component non-depending logic like styles outside the components
  const iconStyle = { height: '20px', mr: -1 }
  const badgeStyle = {
    '& .MuiBadge-badge': {
      transform: 'scale(0.8)',
      right: -14,
      top: -10,
    },
  }

  return (
    <Box
    // color="inherit"
    // sx={{ height: HEADER_HEIGHT, boxShadow: 'none', ...sx }}
    >
      <Box
        sx={{
          width: '100%',
          // borderBottom: '1px solid lightgrey',
          mt: 3,
        }}
      >
        <Box
          sx={{
            width: '90%',
            margin: 'auto',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
          }}
        >
          <img src={offliLogo} alt="Offli logo" style={{ height: '40px' }} />
          <Box
            sx={{
              display: 'flex',
            }}
          >
            {/* <IconButton component={Link} to={ApplicationLocations.SETTINGS}>
              {location === ApplicationLocations.SETTINGS ? (
                <SettingsIcon sx={iconStyle} />
              ) : (
                <SettingsOutlinedIcon sx={iconStyle} />
              )}
            </IconButton>
            <IconButton component={Link} to={ApplicationLocations.BUDDIES}>
              {location === ApplicationLocations.BUDDIES ? (
                <PeopleAltIcon sx={iconStyle} />
              ) : (
                <PeopleAltOutlinedIcon sx={iconStyle} />
              )}
            </IconButton> */}

            <IconButton
              component={Link}
              to={ApplicationLocations.NOTIFICATIONS}
            >
              <Badge
                badgeContent={notificationNumber}
                color="primary"
                sx={badgeStyle}
              >
                {location === ApplicationLocations.NOTIFICATIONS ? (
                  <NotificationsIcon sx={iconStyle} />
                ) : (
                  <NotificationsNoneOutlinedIcon
                    sx={iconStyle}
                    // sx={{ color: 'primary.main' }}
                  />
                )}
              </Badge>
            </IconButton>
            <IconButton component={Link} to={ApplicationLocations.SETTINGS}>
              <SettingsIcon
                sx={{ iconStyle, ml: 0.5 }}
                // sx={{ color: 'primary.main' }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OffliHeader
