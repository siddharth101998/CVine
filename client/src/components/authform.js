import { useState, useRef, useEffect } from "react";
import { registerUser, loginUser } from "../authService";
import backgroundVideo from "../assets/login_bg.mp4";
import logo from "../assets/logo.png";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const videoRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.play();
      const stopVideo = () => {
        if (video.currentTime >= 2.5) {
          video.pause();
          video.currentTime = 2.5;
          setShowForm(true);
        }
      };

      video.addEventListener("timeupdate", stopVideo);
      return () => video.removeEventListener("timeupdate", stopVideo);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "firstName") setFirstName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }

      if (isRegister) {
        await registerUser(email, password);
        alert("Registered successfully!");
      } else {
        await loginUser(email, password);

        // Call backend API to get user details from MongoDB
        const res = await axios.post("http://localhost:5002/user/login", {
          email,
          password,
        });

        if (res.status === 200) {
          login(res.data.user);
          alert("Logged in successfully!");
          navigate("/homepage");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
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
          zIndex: -1,
        }}
      />

      {showForm && (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={10}
              sx={{
                p: 5,
                borderRadius: 4,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
            >
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

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {isRegister ? "Sign Up" : "Welcome Back!"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 3, fontSize: "1rem", color: "text.secondary" }}
              >
                {isRegister ? "Create an account to get started!" : "Log in to continue"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    background: isRegister
                      ? "linear-gradient(45deg, #722F37, #B22222)"
                      : "linear-gradient(45deg, #2E8B57, #3CB371)",
                    "&:hover": {
                      background: isRegister
                        ? "linear-gradient(45deg, #B22222, #722F37)"
                        : "linear-gradient(45deg, #3CB371, #2E8B57)",
                    },
                  }}
                >
                  {isRegister ? "Register" : "Login"}
                </Button>

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
