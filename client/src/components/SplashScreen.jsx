import { Box, Typography } from "@mui/material";

const SplashScreen = () => (
    <Box
    sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: 'url(/assets/bg_img.jpg)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
    }}
    >
    {/* <Typography variant="h2" fontWeight="bold">
        Threadly
    </Typography>
    <Typography variant="h6">Stitching People Together, One Thread at a Time</Typography> */}
    </Box>
);

export default SplashScreen;
