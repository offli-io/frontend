import * as React from 'react'
import { useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import OfflineBoltOutlinedIcon from '@mui/icons-material/OfflineBoltOutlined'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AddCircleIcon from '@mui/icons-material/AddCircleOutline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

export const BottomNavigationPaths = {
  MY_ACTIVITES: 'myactivites',
  SEARCH: 'search',
  CREATE: 'create',
  PROFILE: 'profile',
}

const BottomNavigator: React.FC = () => {
  const [value, setValue] = React.useState('recents')
  // const location = useLocation().pathname

  //   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //     setValue(newValue)
  //   }

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
        sx={{
          '& .Mui-selected': {
            fontSize: 12,
          },
        }}
      >
        <BottomNavigationAction
          label="My Activities"
          // icon={location === BottomNavigationPaths.MY_ACTIVITES
          //   ? (<OfflineBoltIcon sx={{ transform: 'rotate(30deg)' }})
          //   : (<OfflineBoltOutlinedIcon sx={{ transform: 'rotate(30deg)' }})/>}
          icon={<OfflineBoltOutlinedIcon sx={{ transform: 'rotate(30deg)' }} />}
          component={Link}
          value={BottomNavigationPaths.MY_ACTIVITES}
          to="activites"
        />
        <BottomNavigationAction
          label="Explore"
          icon={<TravelExploreIcon />}
          component={Link}
          value={BottomNavigationPaths.SEARCH}
          to="search"
        />
        <BottomNavigationAction
          label="Create"
          icon={<AddCircleOutlineIcon />}
          component={Link}
          value={BottomNavigationPaths.CREATE}
          to="create"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<AccountCircleOutlinedIcon />}
          component={Link}
          value={BottomNavigationPaths.PROFILE}
          to="profile"
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNavigator
