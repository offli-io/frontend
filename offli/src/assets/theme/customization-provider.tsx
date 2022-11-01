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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 50,
          // width: '90%',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // height: 40,
          // width: '70%',
          borderRadius: 12,
          textTransform: 'none',
          fontSize: '20px',
          // fontWeight: 'bold',
          margin: 2,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 36,
          fontWeight: 'bold',
        },
        h2: {
          fontSize: 26,
          fontWeight: 'bold',
        },
        h3: {
          fontSize: 22,
          fontWeight: 'bold',
        },
        h4: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        h5: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        h6: {
          fontSize: 16,
        },
        subtitle1: {
          fontSize: 14,
          // fontWeight: 'bold',
        },
        subtitle2: {
          fontSize: 12,
          // fontWeight: 'bold',
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
