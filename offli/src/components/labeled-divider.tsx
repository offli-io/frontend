import { Box, DividerProps, SxProps } from '@mui/material'

interface ILabeledDividerProps {
  children: React.ReactElement
  sx?: SxProps
}

const LabeledDivider: React.FC<ILabeledDividerProps> = ({ children, sx }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '70%', ...sx }}>
      <Box
        sx={{
          borderBottom: theme => `1px solid ${theme.palette.inactive.main}`,
          width: '100%',
        }}
      />
      <Box
        component="span"
        sx={{
          paddingTop: 0.5,
          paddingBottom: 0.5,
          paddingRight: 2,
          paddingLeft: 2,
          fontWeight: 500,
          fontSize: 22,
          color: 'inactive.main',
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          borderBottom: theme => `1px solid ${theme.palette.inactive.main}`,
          width: '100%',
        }}
      />
    </Box>
  )
}
export default LabeledDivider
