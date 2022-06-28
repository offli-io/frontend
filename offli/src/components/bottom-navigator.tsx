import * as React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Paper } from '@mui/material'
import { Link } from 'react-router-dom'

const BottomNavigator: React.FC = () => {
  const [value, setValue] = React.useState('recents')

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
      >
        <BottomNavigationAction
          label="Recents"
          icon={<RestoreIcon />}
          component={Link}
          value=""
          to="recents"
        />
        <BottomNavigationAction
          label="Favorites"
          icon={<FavoriteIcon />}
          component={Link}
          value=""
          to="recents"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<LocationOnIcon />}
          component={Link}
          value=""
          to="recents"
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNavigator
