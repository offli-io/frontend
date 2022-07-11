import { Box, SxProps } from '@mui/system'
import { HEADER_HEIGHT } from '../utils/common-constants'

interface IPageWrapperProps {
  children?: React.ReactElement[]
  sxOverrides?: SxProps
}

// use this component to avoid negative margins by providing same margin-top as is header height to every screen
export const PageWrapper: React.FC<IPageWrapperProps> = ({
  children,
  sxOverrides,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: HEADER_HEIGHT / 8,
        ...sxOverrides,
      }}
    >
      {children}
    </Box>
  )
}
