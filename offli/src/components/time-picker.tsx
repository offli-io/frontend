import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { SxProps } from '@mui/material'

const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
      index % 2 === 0 ? '00' : '30'
    }`
)

interface ITimePickerProps {
  label: string
  sx?: SxProps
}

const TimePicker: React.FC<ITimePickerProps> = ({ label, sx }) => {
  return (
    <Autocomplete
      id="disabled-options-demo"
      options={timeSlots}
      sx={sx}
      renderInput={params => <TextField {...params} label={label} />}
    />
  )
}

export default TimePicker
