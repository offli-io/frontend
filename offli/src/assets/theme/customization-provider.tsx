import { ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import React from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A148C',
    },
    secondary: {
      main: '#ffa500',
    },
  },
})

interface ICustomizationProviderProps {
  children: React.ReactElement
}

export const CustomizationProvider: React.FC<ICustomizationProviderProps> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
