import { Box, styled, Typography } from '@mui/material'
import logo from '../assets/img/profilePicture.jpg'

interface ILabeledDividerProps {
  username?: string
  children?: React.ReactElement
}

const StyledImage = styled((props: any) => <img {...props} />)`
  height: 40px;
  width: 40px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`

const BuddyItem: React.FC<ILabeledDividerProps> = ({ children, username }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        px: 1,
      }}
    >
      <StyledImage src={logo} alt="profile picture" />
      <Typography sx={{ ml: 4 }}>{username}</Typography>
    </Box>
  )
}
export default BuddyItem
