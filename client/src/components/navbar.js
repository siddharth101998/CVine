import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

    // Define left and right navigation items separately
    const leftNavItems = [
        { label: "Home", url: "/homepage" },
        { label: "Scan Wine", url: "/scan-wine" },
        { label: "Get Recommendation", url: "/recommend" }
    ];

    const rightNavItems = [
        { label: "Pairing Guide", url: "/pairing-guide" },
        { label: "About Us", url: "/about-us" },
        { label: "Login/Register", url: "/login-register" },
        { label: "Profile", url: "/profile" }
    ];

    // For mobile view, show all nav items in order (left + right)
    const mobileNavItems = [...leftNavItems, ...rightNavItems];

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
                        {leftNavItems.map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    onClick={() => navigate(item.url)}
                                    sx={{
                                        color: "black",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: "normal",
                                        position: "relative",
                                        '&:hover': {
                                            color: "#b22222",
                                            fontWeight: "bold",
                                            fontSize: "1.125rem",
                                        },
                                        '&:hover::after': {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "4px",
                                            backgroundColor: "#b22222",
                                        }
                                    }}
                                >
                                    {item.label}
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
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 6,
                            flexGrow: 1,
                            justifyContent: "flex-end",
                        }}
                    >
                        {rightNavItems.map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    onClick={() => navigate(item.url)}
                                    sx={{
                                        color: "black",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: "normal",
                                        position: "relative",
                                        '&:hover': {
                                            color: "#b22222",
                                            fontWeight: "bold",
                                            fontSize: "1.125rem",
                                        },
                                        '&:hover::after': {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "4px",
                                            backgroundColor: "#b22222",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                    {mobileNavItems.map((item, index) => (
                        <ListItem
                            button
                            key={index}
                            onClick={() => {
                                handleDrawerToggle();
                                navigate(item.url);
                            }}
                        >
                            <ListItemText primary={item.label} />
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