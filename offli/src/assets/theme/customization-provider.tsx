import { ThemeProvider } from '@mui/material'
import { createTheme, ThemeOptions } from '@mui/material/styles'
import React from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#006400',
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
