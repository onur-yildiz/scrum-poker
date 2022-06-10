import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#77ab2d",
      dark: "#5e9214",
      light: "#95be5c",
    },
    secondary: {
      main: grey[300],
      dark: grey[500],
      light: grey[100],
    },
    background: {
      default: grey[800],
      paper: grey[900],
    },
    text: {
      // primary: blueGrey[800],
      // secondary: blueGrey[600],
    },
  },
});

export default darkTheme;
