import { Box, Button, styled, Typography } from '@mui/material'
import logo from '../assets/img/profilePicture.jpg'

interface ILabeledDividerProps {
  imageSource?: string
  onClick?: () => void
  username?: string
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
  onClick,
  ...rest
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        px: 1,
        py: 2,
        textTransform: 'none',
        width: '100%',
      }}
      {...rest}
    >
      <StyledImage src={imageSource ?? logo} alt="profile picture" />
      <Typography sx={{ ml: 4, color: 'black' }}>{username}</Typography>
    </Button>
  )
}
export default BuddyItem
