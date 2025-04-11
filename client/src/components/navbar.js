import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Use user's name if logged in, otherwise show "Login/Register"
    const lastNavItem = user ? user.name : "Login/Register";
    const navItems = [
        "Home",
        "Chatbot",
        "Recipe",
        "Pairing Guide",
        "About",
        lastNavItem
    ];

    // Navigation logic for each button.
    const handleNavClick = (item) => {
        if (item === lastNavItem) {
            if (user) {
                navigate("/profile");
            } else {
                navigate("/login_register");
            }
        } else {
            switch (item) {
                case "Home":
                    navigate("/");
                    break;
                case "Chatbot":
                    navigate("/chat");
                    break;
                case "Recipe":
                    navigate("/recipe");
                    break;
                case "Pairing Guide":
                    navigate("/pairing-guide");
                    break;
                case "About":
                    navigate("/about");
                    break;
                default:
                    break;
            }
        }
    };

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
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 6,
                            flexGrow: 1,
                            justifyContent: "flex-start",
                            zIndex: 2 // ensure these are above the logo
                        }}
                    >
                        {navItems.slice(0, 3).map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    onClick={() => handleNavClick(item)}
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
                                    {item}
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* Logo in the Center */}
                    <Box
                        sx={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 1, // logo sits behind the buttons
                            '& img': {
                                transition: "transform 0.3s ease-in-out",
                            },
                            '& img:hover': {
                                transform: "scale(1.5)",
                            }
                        }}
                    >
                        <img src={Logo} alt="CVine Logo" style={{ height: "80px" }} />
                    </Box>

                    {/* Navigation Links (Right Side) */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 6,
                            justifyContent: "flex-end",
                            zIndex: 3, // bring these to the front
                            mr: 2 // optional: add some right margin for spacing
                        }}
                    >
                        {navItems.slice(3).map((item, index) => (
                            <Box key={index} sx={{ position: "relative", display: "inline-block" }}>
                                <Button
                                    onClick={() => handleNavClick(item)}
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
                        <ListItem
                            button
                            key={index}
                            onClick={() => {
                                handleDrawerToggle();
                                handleNavClick(item);
                            }}
                        >
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
