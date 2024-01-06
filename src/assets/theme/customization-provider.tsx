import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useUserSettings } from 'hooks/use-user-settings';
import React from 'react';
import { Toaster } from 'sonner';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

declare module '@mui/material/styles' {
  // If we would like to declare something on the theme
  // https://mui.com/material-ui/customization/palette/ down on the site

  // interface Theme {
  //   status: {
  //     danger: React.CSSProperties['color'];
  //   };
  // }
  interface Palette {
    inactive: Palette['primary'];
    inactiveFont: Palette['primary'];
  }
  interface PaletteOptions {
    inactive: PaletteOptions['primary'];
    inactiveFont: PaletteOptions['primary'];
  }
}
const createCustomizationTheme = (userTheme: ThemeOptionsEnumDto) => {
  const theme = createTheme({
    palette: {
      // for dark mode
      mode: userTheme === ThemeOptionsEnumDto.DARK ? 'dark' : 'light',
      primary: {
        main: userTheme === ThemeOptionsEnumDto.LIGHT ? '#4A148C' : '#7D3FC8',
        light: '#DED5EA'
      },
      secondary: {
        main: '#E4E3FF'
      },
      inactive: {
        main: '#B8B8B8'
      },
      inactiveFont: {
        main: '#757575'
      }
    },
    typography: {
      fontFamily: 'Instagram Sans'
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            height: 50,
            // width: '90%',
            borderRadius: 12
          }
        }
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
            margin: 2
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: 'Instagram Sans',
            color: theme?.palette?.text?.primary
            // ...(mode === "dark" ? { filter: "invert(100%)" } : {}),
          }),
          h1: {
            fontSize: 28,
            fontWeight: '500',
            fontFamily: 'Instagram Sans'
          },
          h2: {
            fontSize: 24,
            fontWeight: '500',
            fontFamily: 'Instagram Sans'
          },
          h3: {
            fontSize: 20,
            fontWeight: '500',
            fontFamily: 'Instagram Sans'
          },
          // TODO This is kinda good
          // h4: {
          //   fontSize: 20,
          //   fontWeight: "500",
          //   fontFamily: "Helvetica Neue",
          // },
          h4: {
            fontSize: 20,
            fontWeight: '500',
            fontFamily: 'Instagram Sans'
          },
          h5: {
            fontSize: 18,
            fontWeight: '500',
            fontFamily: 'Instagram Sans'
          },
          h6: {
            fontSize: 16
          },
          subtitle1: {
            fontSize: 14
            // fontWeight: 'bold',
          },
          // subtitle 2 should be used for state "no-data" texts
          subtitle2: ({ theme }) => ({
            fontSize: 16,
            color: theme.palette.inactiveFont.main
            // fontWeight: 'bold',
          })
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: 'Instagram Sans',
            color: theme?.palette?.text?.primary
            // ...(mode === "dark" ? { filter: "invert(100%)" } : {}),
          })
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme?.palette?.primary?.main
            // ...(mode === "dark" ? { filter: "invert(100%)" } : {}),
          })
        }
      }
    }
  });

  return theme;
};

interface ICustomizationContext {
  theme?: ThemeOptionsEnumDto;
}

export const CustomizationContext = React.createContext<ICustomizationContext>(
  {} as ICustomizationContext
);

interface ICustomizationProviderProps {
  children: React.ReactElement;
}

export const CustomizationProvider: React.FC<ICustomizationProviderProps> = ({ children }) => {
  const { data: { data: { theme = ThemeOptionsEnumDto.LIGHT } = {} } = {} } = useUserSettings();

  return (
    <CustomizationContext.Provider value={{ theme }}>
      <ThemeProvider theme={createCustomizationTheme(theme)}>
        <Toaster richColors invert={theme === ThemeOptionsEnumDto.DARK} />
        {children}
      </ThemeProvider>
    </CustomizationContext.Provider>
  );
};
