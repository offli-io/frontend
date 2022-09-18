import { Box, CardActionArea, DividerProps, SxProps } from '@mui/material'
import logo from '../assets/img/gym.svg'
import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface ILabeledTileProps {
  label?: string
  imageUrl?: string
  sx?: SxProps
  onClick: (id: number) => void
}

const LabeledTile: React.FC<ILabeledTileProps> = ({
  label,
  imageUrl,
  sx,
  onClick,
}) => {
  const [selected, setSelected] = React.useState<boolean>(false)

  const handleCardClick = React.useCallback(() => {
    setSelected(selected => !selected)
    onClick(22)
  }, [onClick])

  return (
    <Card
      sx={{
        backgroundColor: 'transparent',
        position: 'relative',
        width: 135,
        height: 100,
        borderRadius: 2,
        ...(selected
          ? { border: theme => `2px solid ${theme.palette.primary.main}` }
          : {}),
        ...sx,
      }}
    >
      <Button
        sx={{ bgcolor: 'transparent', width: '100%', height: '100%' }}
        onClick={handleCardClick}
      >
        <img
          src={imageUrl ?? logo}
          style={{
            width: '100%',
            height: 100,
            maxWidth: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -1,
            opacity: selected ? 0.8 : 0.6,
          }}
        ></img>
        <Box sx={{ position: 'absolute', bottom: 10, left: 0, width: '60%' }}>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            {label}
          </Typography>
        </Box>
      </Button>
    </Card>
  )
}
export default LabeledTile
