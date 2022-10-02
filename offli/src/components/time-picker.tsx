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
  onChange: (value: string | null) => void
}

const TimePicker: React.FC<ITimePickerProps> = ({ label, sx, onChange }) => {
  return (
    <Autocomplete
      id="disabled-options-demo"
      options={timeSlots}
      sx={sx}
      onChange={(event: React.SyntheticEvent, value: string | null) =>
        onChange(value)
      }
      renderInput={params => <TextField {...params} label={label} />}
    />
  )
}

export default TimePicker
