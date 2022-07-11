import * as React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import { Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export const BottomNavigationPaths = {
  MY_ACTIVITES: 'myactivites',
  SEARCH: 'search',
  CREATE: 'create',
  PROFILE: 'profile',
}

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
          label="Activites"
          icon={<CalendarTodayIcon />}
          component={Link}
          value={BottomNavigationPaths.MY_ACTIVITES}
          to="activites"
        />
        <BottomNavigationAction
          label="Search"
          icon={<SearchIcon />}
          component={Link}
          value={BottomNavigationPaths.SEARCH}
          to="search"
        />
        <BottomNavigationAction
          label="Create"
          icon={<AddIcon />}
          component={Link}
          value={BottomNavigationPaths.CREATE}
          to="create"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          component={Link}
          value={BottomNavigationPaths.PROFILE}
          to="profile"
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNavigator
