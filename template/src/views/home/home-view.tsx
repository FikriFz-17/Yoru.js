import { Box, Typography, Link } from "@mui/material";
import { containerSx, codeSx, linkSx } from "./home-view-style";

export const HomeView = () => {
  return (
    <Box sx={containerSx}>
      <Typography variant="h4" sx={{ fontSize: "inherit" }}>
        welcome to yoru.js, simple react boilerplate for beginner developers
      </Typography>
      
      <Link 
        href="https://github.com/yoru-js" 
        target="_blank" 
        rel="noopener noreferrer"
        sx={linkSx}
      >
        Learn Yoru.js
      </Link>
    </Box>
  );
};
