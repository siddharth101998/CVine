import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Switch, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Logo from "../assets/logo.png";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = ["Home", "Scan Wine", "Wine Library", "Pairing Guide", "About Us", "Login/Register"];

    return (
        <>
            {/* Top Navigation Bar */}
            <AppBar
                position="sticky"
                sx={{
                    background: "#f2e1e5",
                    boxShadow: "none",
                    transition: "0.3s ease-in-out",
                    height: "80px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                    {/* Mobile Menu Button */}
                    <IconButton sx={{ display: { md: "none" }, color: "black" }} onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                    
                    {/* Navigation Links (Left Side) */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 6, flexGrow: 1, justifyContent: "flex-start" }}>
                        {navItems.slice(0, 3).map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    sx={{
                                        color: "black",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: "normal",
                                        position: "relative",
                                        '&:hover': {
                                            color: "#b22222",
                                            fontWeight: "bold",
                                            fontSize: "1.125rem", // 2pt larger
                                        },
                                        '&:hover::after': {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "4px", // 2pt larger
                                            backgroundColor: "#b22222",
                                        }
                                    }}
                                >
                                    {item}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                    
{/* Logo in the Center */}
<Box sx={{ 
    position: "absolute", 
    left: "50%", 
    transform: "translateX(-50%)", 
    '& img': {
        transition: "transform 0.3s ease-in-out",
    },
    '& img:hover': {
        transform: "scale(1.5)",
    }
}}>
    <img src={Logo} alt="CVine Logo" style={{ height: "80px" }} />
</Box>

                    
                    {/* Navigation Links (Right Side) */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 6, flexGrow: 1, justifyContent: "flex-end" }}>
                        {navItems.slice(3).map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    onClick={() => item === "Login/Register" && navigate("/login_register")}
                                    sx={{
                                        color: "black",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: "normal",
                                        position: "relative",
                                        '&:hover': {
                                            color: "#b22222",
                                            fontWeight: "bold",
                                            fontSize: "1.125rem", // 2pt larger
                                        },
                                        '&:hover::after': {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "4px", // 2pt larger
                                            backgroundColor: "#b22222",
                                        }
                                    }}
                                >
                                    {item}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                    {navItems.map((item, index) => (
                        <ListItem button key={index} onClick={() => { handleDrawerToggle(); if (item === "Login/Register") navigate("/login_register"); }}>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Floating Scan Button */}
            <IconButton
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#B22222",
                    color: "white",
                    padding: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    '&:hover': { backgroundColor: "#722F37" },
                }}
            >
                <CameraAltIcon />
            </IconButton>
        </>
    );
};

export default Navbar;