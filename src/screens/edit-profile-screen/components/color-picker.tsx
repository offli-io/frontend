import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import OffliButton from "components/offli-button";

export interface IColorProps {
    onColorChange: (color : string | null) => void;
}


const ColorPicker: React.FC<IColorProps> = ({onColorChange}) => {

    const [color, setColor] = useState("#aabbcc");

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const handleColorSelect = () => {
        onColorChange(color)
    }

    return (
      <Box sx={{
        width: "100%",
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
        }}>
        <Typography variant="h5" sx={{mb: 2}}>Choose your profile background color</Typography>
        <HexColorPicker color={color} onChange={setColor} style={{width: "80%"}}/>
        <TextField 
        sx={{width: "60%", mt: 2,}} 
        InputProps={{
          style: { textAlign: "center" },
          inputProps: {
            style: {
              textAlign: "center",
            },
          },
        }} placeholder={color} onChange={handleColorChange} defaultValue={color}/>
        <OffliButton sx={{width: "60%", mt: 2}} onClick={handleColorSelect}>Select</OffliButton>
      </Box>
    );
  };
  
  export default ColorPicker;