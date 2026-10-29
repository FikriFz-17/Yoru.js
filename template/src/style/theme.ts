import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.background,
    },
    text: {
      primary: colors.textPrimary,
    },
    primary: {
      main: colors.link,
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          margin: 0,
        }
      }
    }
  }
});
