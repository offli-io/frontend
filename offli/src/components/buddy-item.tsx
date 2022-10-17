import { Box, Button, Checkbox, styled, Typography } from '@mui/material'
import logo from '../assets/img/profilePicture.jpg'
import React from 'react'

interface ILabeledDividerProps {
  imageSource?: string
  onClick?: (id: number, checked?: boolean) => void
  username?: string
  checkbox?: boolean
  id: number
  children?: React.ReactElement
}

const StyledImage = styled((props: any) => <img {...props} />)`
  height: 40px;
  width: 40px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`

const BuddyItem: React.FC<ILabeledDividerProps> = ({
  imageSource,
  children,
  username,
  checkbox,
  id,
  onClick,
  ...rest
}) => {
  const [checked, setChecked] = React.useState(false)

  const handleClick = React.useCallback(
    (checked: boolean) => {
      checkbox && setChecked(prevState => !prevState)
      onClick && onClick(id, !checked)
    },
    [onClick, setChecked, id]
  )
  return (
    <Button
      onClick={() => handleClick(checked)}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
        py: 2,
        textTransform: 'none',
        width: '100%',
      }}
      {...rest}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledImage src={imageSource ?? logo} alt="profile picture" />
        <Typography sx={{ ml: 4, color: 'black' }}>{username}</Typography>
      </Box>
      {checkbox && <Checkbox checked={checked} />}
    </Button>
  )
}
export default BuddyItem
