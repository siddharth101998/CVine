import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import backgroundVideo from "../assets/fizz_button_bg.mp4"; // Background video

const Navbar = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "80px", overflow: "hidden" }}>
            {/* Background Video */}
            <video
                src={backgroundVideo}
                autoPlay
                loop
                muted
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1, // Keep behind the navbar
                }}
            />

            {/* Navbar */}
            <AppBar position="static" sx={{ background: "transparent", boxShadow: "none" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    {/* Left - Navigation Links */}
                    <Box sx={{ display: "flex", gap: 3 }}>
                        <Button component={Link} to="/" sx={navButtonStyle}>
                            Home
                        </Button>
                        <Button component={Link} to="/discover" sx={navButtonStyle}>
                            Discover
                        </Button>
                        <Button component={Link} to="/about" sx={navButtonStyle}>
                            About
                        </Button>
                        <Button component={Link} to="/contact" sx={navButtonStyle}>
                            Contact
                        </Button>
                    </Box>

                    {/* Right - Auth Buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button component={Link} to="/login" sx={authButtonStyle}>
                            Login
                        </Button>
                        <Button component={Link} to="/signup" sx={signupButtonStyle}>
                            Sign Up
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

// Common Styles for Navbar Buttons
const navButtonStyle = {
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    textTransform: "none",
    "&:hover": { color: "#FFD700" },
};

// Login Button Style
const authButtonStyle = {
    color: "white",
    fontWeight: "bold",
    border: "2px solid white",
    borderRadius: "20px",
    padding: "5px 15px",
    textTransform: "none",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        borderColor: "#FFD700",
    },
};

// Signup Button Style
const signupButtonStyle = {
    background: "linear-gradient(45deg, #FF416C, #FF4B2B)",
    color: "white",
    fontWeight: "bold",
    borderRadius: "20px",
    padding: "5px 20px",
    textTransform: "none",
    "&:hover": { background: "linear-gradient(45deg, #FF4B2B, #FF416C)" },
};

export default Navbar;
