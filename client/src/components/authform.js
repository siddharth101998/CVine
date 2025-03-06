import { useState, useRef, useEffect } from "react";
import { registerUser, loginUser } from "../authService";
import backgroundVideo from "../assets/login_bg.mp4";
import logo from "../assets/logo.png"; // Import Logo
import { Box, Container, Paper, Typography, TextField, Button, Link } from "@mui/material";

const AuthForm = () => {
    // State variables to manage form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Toggles between Register/Login form
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false); // Controls form & logo visibility after 2.5 seconds
    const videoRef = useRef(null); // Reference to the video element

    // Effect to control video playback and display form + logo after 2.5 seconds
    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            video.play();
            const stopVideo = () => {
                if (video.currentTime >= 2.5) { // After 2.5 seconds
                    video.pause();
                    video.currentTime = 2.5; // Keep video paused here
                    setShowForm(true); // Show the form & logo
                }
            };

            video.addEventListener("timeupdate", stopVideo);

            return () => {
                video.removeEventListener("timeupdate", stopVideo);
            };
        }
    }, []);

    // Handle input changes in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
        else if (name === "firstName") setFirstName(value);
    };

    // Handle form submission for login or register
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await registerUser(email, password);
                alert("Registered successfully!");
            } else {
                await loginUser(email, password);
                alert("Logged in successfully!");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            {/* Background Video */}
            <video
                ref={videoRef}
                src={backgroundVideo}
                autoPlay
                muted
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1, // Keep in background
                }}
            />

            {/* Show the login/register form and logo after 2.5 seconds */}
            {showForm && (
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        padding: 3,
                    }}
                >
                    <Container maxWidth="sm">
                        <Paper
                            elevation={10}
                            sx={{
                                p: 5,
                                borderRadius: 4,
                                backdropFilter: "blur(10px)", // Frosted glass effect
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                                color: "black",
                                textAlign: "center",
                                position: "relative",
                                
                            }}
                        >
                            {/* Logo Appears at the Top */}
                            <Box sx={{ textAlign: "center", mb: 2 }}>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{
                                        width: "250px", 
                                        height: "240px",
                                        display: "block",
                                        margin: "auto",
                                        marginBottom: "50px",

                                    }}
                                />
                            </Box>

                            {/* Heading */}
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                {isRegister ? "Sign Up" : "Welcome Back!"}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, fontSize: "1rem", color: "text.secondary" }}>
                                {isRegister ? "Create an account to get started!" : "Log in to continue"}
                            </Typography>

                            {/* Form Section */}
                            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {/* Show First Name field only for registration */}
                                {isRegister && (
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        name="firstName"
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    />
                                )}
                                {/* Email Field */}
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                />
                                {/* Password Field */}
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                />
                                {/* Submit Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        background: isRegister
                                        ? "linear-gradient(45deg, #722F37, #B22222)" // Wine gradient for Register
                                        : "linear-gradient(45deg, #2E8B57, #3CB371)", // Green gradient for Login
                                    "&:hover": {
                                        background: isRegister
                                            ? "linear-gradient(45deg, #B22222, #722F37)" // Darker Wine on Hover
                                            : "linear-gradient(45deg, #3CB371, #2E8B57)", // Darker Green on Hover
                                    },
                                    
                                    }}
                                >
                                    {isRegister ? "Register" : "Login"}
                                </Button>

                                {/* Toggle Between Register and Login */}
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    {isRegister ? (
                                        <>
                                            Already have an account?{" "}
                                            <Link
                                                href="#"
                                                onClick={() => setIsRegister(false)}
                                                sx={{ color: "red", fontWeight: "bold" }}
                                            >
                                                Login
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            Don't have an account?{" "}
                                            <Link
                                                href="#"
                                                onClick={() => setIsRegister(true)}
                                                sx={{ color: "red", fontWeight: "bold" }}
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </Typography>
                            </Box>

                            {/* Display error message if any */}
                            {error && (
                                <Typography variant="body1" color="error.main" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            )}
                        </Paper>
                    </Container>
                </Box>
            )}
        </Box>
    );
};

export default AuthForm;
