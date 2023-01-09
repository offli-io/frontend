import { Box, CardActionArea, DividerProps, SxProps } from '@mui/material'
import logo from '../assets/img/gym.svg'
import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { LatLngTuple } from 'leaflet'

interface ILabeledTileProps {
  title?: string
  imageUrl?: string
  sx?: SxProps
  onClick?: (title: string) => void
}

const position = [51.505, -0.09] as LatLngTuple

const Map: React.FC<ILabeledTileProps> = ({ title, imageUrl, sx, onClick }) => {
  const [selected, setSelected] = React.useState<boolean>(false)

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'fixed' }}>
      {/* <div id="map" style={{ height: 200 }}></div> */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  )
}
export default Map
