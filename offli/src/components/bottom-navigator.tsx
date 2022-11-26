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
import { ApplicationLocations } from '../types/common/applications-locations.dto'

const BottomNavigator: React.FC = () => {
  const [value, setValue] = React.useState<ApplicationLocations>(
    ApplicationLocations.ACTIVITES
  )
  const location = useLocation()

  React.useEffect(() => {
    setValue(location?.pathname as ApplicationLocations)
  }, [location])

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
            fontSize: '12px !important',
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
          value={ApplicationLocations.ACTIVITES}
          to={ApplicationLocations.ACTIVITES}
        />
        <BottomNavigationAction
          label="Explore"
          icon={<TravelExploreIcon />}
          component={Link}
          value={ApplicationLocations.SEARCH}
          to={ApplicationLocations.SEARCH}
        />
        <BottomNavigationAction
          label="Create"
          icon={<AddCircleOutlineIcon />}
          component={Link}
          value={ApplicationLocations.CREATE}
          to={ApplicationLocations.CREATE}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<AccountCircleOutlinedIcon />}
          component={Link}
          value={ApplicationLocations.PROFILE}
          to={ApplicationLocations.PROFILE}
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNavigator
