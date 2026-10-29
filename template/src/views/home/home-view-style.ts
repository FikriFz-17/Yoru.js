import type { SxProps, Theme } from "@mui/material";

export const containerSx: SxProps<Theme> = {
  backgroundColor: "background.default",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "text.primary",
  textAlign: "center"
};

export const codeSx: SxProps<Theme> = {
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
};

export const linkSx: SxProps<Theme> = {
  color: "primary.main",
  textDecoration: "none",
  marginTop: 3,
  "&:hover": {
    textDecoration: "underline"
  }
};
