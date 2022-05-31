import { blueGrey, grey } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// declare module "@mui/material/styles" {
//   // interface Theme {
//   //   status: {
//   //     danger: React.CSSProperties["color"];
//   //   };
//   // }
//   //   interface Palette {
//   //     neutral: Palette["primary"];
//   //   }
//   //   interface PaletteOptions {
//   //     neutral: PaletteOptions["primary"];
//   //   }
//   //   interface PaletteColor {
//   //     darker?: string;
//   //   }
//   //   interface SimplePaletteColorOptions {
//   //     darker?: string;
//   //   }
//   // interface ThemeOptions {
//   //   status: {
//   //     danger: React.CSSProperties["color"];
//   //   };
//   // }
// }

let lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#68a216",
      dark: "#3b5d0d",
      light: "#94e820",
    },
    secondary: {
      main: blueGrey[500],
      dark: blueGrey[800],
      light: blueGrey[100],
    },
    background: {
      paper: grey[50],
    },
    text: {
      // primary: blueGrey[800],
      // secondary: blueGrey[600],
    },
  },
});

lightTheme = responsiveFontSizes(lightTheme);

// lightTheme.typography.h1 = {
//   fontSize: "3.5rem",
//   fontWeight: "initial",
//   [lightTheme.breakpoints.down("sm")]: {
//     fontSize: "2.8rem",
//   },
//   [lightTheme.breakpoints.up("md")]: {
//     fontSize: "3.8rem",
//   },
// };

export default lightTheme;
