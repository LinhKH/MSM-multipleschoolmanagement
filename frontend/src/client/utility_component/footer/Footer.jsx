import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      component={"div"}
    >
      <Typography variant={"h5"}>Shool Management System</Typography>
      <Typography variant={"p"}>Copyright @2024</Typography>
    </Box>
  );
};

export default Footer;
