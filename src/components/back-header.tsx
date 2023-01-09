import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Badge,
  AppBar,
  Typography,
  SxProps,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

import { ApplicationLocations } from '../types/common/applications-locations.dto'
import offliLogo from '../assets/img/logoPurple.png'
import { HEADER_HEIGHT } from '../utils/common-constants'

interface IBackHeaderProps {
  title?: string
  sx?: SxProps
  to?: string
}

const BackHeader: React.FC<IBackHeaderProps> = ({ title, sx, to }) => {
  const location = useLocation().pathname
  const [notificationNumber] = useState(5)

  const toParsed = to?.split('/')
  const fromLocation = toParsed && `/${toParsed[toParsed?.length - 1]}`

  return (
    <Box sx={{ height: HEADER_HEIGHT, boxShadow: '1px 2px 2px #ccc', ...sx }}>
      <Box
        sx={{
          width: '100%',
          // borderBottom: '1px solid lightgrey',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          p: 2,
          boxSizing: 'border-box',
        }}
      >
        {fromLocation && (
          <IconButton
            component={Link}
            to={fromLocation}
            sx={
              {
                // flex: 1,
                // position: 'absolute',
                // top: 10,
                // left: 5,
                // textTransform: 'none',
              }
            }
          >
            <ArrowBackIosNewIcon

            // sx={{ color: 'primary.main' }}
            />
          </IconButton>
        )}
        <Box
          sx={{
            flex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 6,
          }}
        >
          <Typography variant="h4">{title}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default BackHeader
