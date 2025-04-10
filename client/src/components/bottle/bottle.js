import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Fade,
} from "@mui/material";
import { keyframes } from "@mui/system";
import WineBarIcon from "@mui/icons-material/WineBar";
import StoreIcon from "@mui/icons-material/Store";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PublicIcon from "@mui/icons-material/Public";
import PercentIcon from "@mui/icons-material/Percent";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../../context/AuthContext";

// Define keyframe animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fallAnimation = keyframes`
  0% { transform: translateY(-100vh); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const Bottle = () => {
  const { id } = useParams();
  const [bottle, setBottle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const updateBottleView = async () => {
    try {
      const userId = user?._id;
      await axios.post("http://localhost:5002/bottleView/", { bottleId: id, userId });
      console.log("Bottle view updated successfully.");
    } catch (error) {
      console.error("Error updating bottle view:", error);
    }
  };

  useEffect(() => {
    const fetchBottle = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/bottle/${id}`);
        console.log("Bottle Data:", response.data.data);
        setBottle(response.data.data);
        setLoading(false);
        // Optionally, update the view count:
        // updateBottleView();
      } catch (err) {
        setError("Failed to load bottle details.");
        setLoading(false);
      }
    };
    fetchBottle();
  }, [id]);

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Common styles for typography and icons
  const commonTypography = {
    fontFamily: "Roboto, sans-serif",
    animation: `${fallAnimation} 1s ease-out`,
    display: "flex",
    alignItems: "center",
    transition: "transform 0.3s ease",
    "&:hover": { transform: "scale(1.05)" },
  };

  const commonIconStyle = {
    fontSize: "2rem",
    animation: `${fallAnimation} 1s ease-out`,
    transition: "transform 0.3s",
    marginRight: "0.5rem",
    "&:hover": { transform: "scale(1.3)" },
  };

  return (
    <Box sx={{ background: "linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)" }}>
      <Fade in={true} timeout={1500}>
        <Card
          sx={{
            minHeight: "100vh",
            margin: "auto",
            borderRadius: "15px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            background: "linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)",
            backgroundSize: "600% 600%",
            animation: `${gradientAnimation} 10s ease infinite`,
            overflow: "hidden",
          }}
        >
          <CardContent>
            {/* Two-Column Layout */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
              {/* Left Column: Bottle Name & Image */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Bottle Name above the image */}
                <Typography
                  variant="h4"
                  sx={{ ...commonTypography, fontSize: "2.5rem", fontWeight: "bold", cursor: "pointer" }}
                >
                  {bottle.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    animation: `${bounceAnimation} 2s infinite`,
                  }}
                >
                  <Box
                    component="img"
                    src={bottle.imageUrl}
                    alt={bottle.name}
                    sx={{
                      width: "100%",
                      borderRadius: "10px",
                      maxHeight: "60vh",
                      objectFit: "contain",
                      animation: `${rotateAnimation} 1s ease-out 1 forwards`,
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                      cursor: "pointer"
                    }}
                  />
                </Box>
              </Box>

              {/* Right Column: Bottle Details without a background card */}
              <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" }}>
                <Typography variant="h6" sx={{ ...commonTypography, fontSize: "1.5rem" }}>
                  <WineBarIcon
                    sx={{
                      ...commonIconStyle,
                      color: "red",
                    }}
                  />
                  Wine Type: {bottle.wineType}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <StoreIcon
                    sx={{
                      ...commonIconStyle,
                      color: "#673ab7",
                    }}
                  />
                  Brand: {bottle.winery}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <LocalOfferIcon
                    sx={{
                      ...commonIconStyle,
                      color: "green",
                    }}
                  />
                  Avg Price: {bottle.price}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <PublicIcon
                    sx={{
                      ...commonIconStyle,
                      color: "#ff9800",
                    }}
                  />
                  Region: {bottle.region}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <PercentIcon
                    sx={{
                      ...commonIconStyle,
                      color: "#f44336",
                    }}
                  />
                  Alcohol Content: {bottle.alcoholContent}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <StarIcon
                    sx={{
                      ...commonIconStyle,
                      color: "#ffb400",
                    }}
                  />
                  Average Rating: {bottle.avgRating}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <PublicIcon
                    sx={{
                      ...commonIconStyle,
                      color: "#2196f3",
                    }}
                  />
                  Country: {bottle.country}
                </Typography>
                <Typography variant="body1" sx={{ ...commonTypography, fontSize: "1.2rem" }}>
                  <WineBarIcon
                    sx={{
                      ...commonIconStyle,
                      color: "purple",
                    }}
                  />
                  Grape Type: {bottle.grapeType}
                </Typography>
              </Box>
            </Box>

            {/* Bottle Description below the main content */}
            <Box sx={{ mt: 4, px: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  ...commonTypography,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                <InfoIcon
                  sx={{
                    ...commonIconStyle,
                    color: "#757575",
                  }}
                />
                {bottle.fullDescription}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Bottle;
