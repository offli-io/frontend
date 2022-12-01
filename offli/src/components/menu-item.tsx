import { Box, Button, Checkbox, styled, Typography } from '@mui/material'
import logo from '../assets/img/profilePicture.jpg'
import React from 'react'
import OffliButton from './offli-button'
import { IPerson } from '../types/activities/activity.dto'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { SettingsTypeEnumDto } from '../types/common/settings-type-enum.dto'
import { ActivityActionsTypeEnumDto } from '../types/common/activity-actions-type-enum.dto'

interface ILabeledDividerProps {
  label?: string
  onMenuItemClick?: (
    type?: SettingsTypeEnumDto | ActivityActionsTypeEnumDto
  ) => void
  type?: SettingsTypeEnumDto | ActivityActionsTypeEnumDto
  icon?: React.ReactElement
  headerRight?: React.ReactElement
}

const StyledImage = styled((props: any) => <img {...props} />)`
  height: 40px;
  width: 40px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`

const MenuItem: React.FC<ILabeledDividerProps> = ({
  label,
  type,
  onMenuItemClick,
  icon,
  headerRight,
  ...rest
}) => {
  return (
    <Box
      onClick={() => onMenuItemClick && onMenuItemClick(type)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.5,
        textTransform: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
      {...rest}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography sx={{ ml: 2, color: 'black' }}>{label}</Typography>
      </Box>
      {headerRight ?? <NavigateNextIcon />}
    </Box>
  )
}
export default MenuItem
