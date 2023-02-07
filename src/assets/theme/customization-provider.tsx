import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React from "react";

declare module "@mui/material/styles" {
  // If we would like to declare something on the theme
  // https://mui.com/material-ui/customization/palette/ down on the site

  // interface Theme {
  //   status: {
  //     danger: React.CSSProperties['color'];
  //   };
  // }
  interface Palette {
    inactive: Palette["primary"];
    inactiveFont: Palette["primary"];
  }
  interface PaletteOptions {
    inactive: PaletteOptions["primary"];
    inactiveFont: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    // for dark mode
    //mode: 'dark',
    primary: {
      main: "#4A148C",
    },
    secondary: {
      main: "#ffa500",
    },
    inactive: {
      main: "#B8B8B8",
    },
    inactiveFont: {
      main: "#757575",
    },
  },
  typography: {
    fontFamily: "Karla",
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
          textTransform: "none",
          fontSize: "20px",
          // fontWeight: 'bold',
          margin: 2,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Karla",
        },
        h1: {
          fontSize: 32,
          fontWeight: "bold",
          fontFamily: "nunito",
        },
        h2: {
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "nunito",
        },
        h3: {
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "nunito",
        },
        h4: {
          fontSize: 20,
          fontWeight: "600",
          fontFamily: "nunito",
        },
        h5: {
          fontSize: 18,
          fontWeight: "bold",
        },
        h6: {
          fontSize: 16,
        },
        subtitle1: {
          fontSize: 14,
          // fontWeight: 'bold',
        },
        // subtitle 2 should be used for state "no-data" texts
        subtitle2: ({ theme }) => ({
          fontSize: 16,
          color: theme.palette.inactiveFont.main,
          // fontWeight: 'bold',
        }),
      },
    },
  },
});

interface ICustomizationProviderProps {
  children: React.ReactElement;
}

export const CustomizationProvider: React.FC<ICustomizationProviderProps> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
