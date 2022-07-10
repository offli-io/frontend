import { ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import React from 'react'

declare module '@mui/material/styles' {
  // If we would like to declare something on the theme
  // https://mui.com/material-ui/customization/palette/ down on the site

  // interface Theme {
  //   status: {
  //     danger: React.CSSProperties['color'];
  //   };
  // }
  interface Palette {
    inactive: Palette['primary']
  }
  interface PaletteOptions {
    inactive: PaletteOptions['primary']
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A148C',
    },
    secondary: {
      main: '#ffa500',
    },
    inactive: {
      main: '#B8B8B8',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 40,
          borderRadius: 10,
        },
      },
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
