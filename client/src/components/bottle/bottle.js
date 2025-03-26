import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,
    Box,
    IconButton,
} from "@mui/material";
import WineBarIcon from "@mui/icons-material/WineBar";
import StoreIcon from "@mui/icons-material/Store";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PublicIcon from "@mui/icons-material/Public";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PercentIcon from "@mui/icons-material/Percent";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom"; // For navigation
import { Button } from "@mui/material"; // For Material-UI buttons
import { useAuth } from "../../context/AuthContext";

const Bottle = () => {
    const { id } = useParams();
    const [bottle, setBottle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const updateBottleView = async () => {
        try {
            const userId = user?._id; // Replace with actual logged-in user ID
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
                // updateBottleView(); // Call the view update function after fetching the bottle
            } catch (err) {
                setError("Failed to load bottle details.");
                setLoading(false);
            }
        };
        fetchBottle();
    }, [id]);

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card
            sx={{
                maxWidth: 700,
                margin: "auto",
                mt: 5,
                p: 3,
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background: "linear-gradient(to right, #ffefba, #ffffff)",
            }}
        >
            <CardContent>
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
                    {bottle.name}
                </Typography>

                {/* Image Section */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                        src={bottle.imageUrl}
                        alt={bottle.name}
                        style={{ width: "100%", borderRadius: "10px", maxHeight: "800px", objectFit: "contain" }}
                    />
                </Box>

                {/* Bottle Details */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <WineBarIcon sx={{ verticalAlign: "middle", mr: 1, color: "red" }} />
                            <strong>Wine Type:</strong> {bottle.wineType}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <StoreIcon sx={{ verticalAlign: "middle", mr: 1, color: "#673ab7" }} />
                            <strong>Brand:</strong> {bottle.winery}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <LocalOfferIcon sx={{ verticalAlign: "middle", mr: 1, color: "green" }} />
                            <strong>Price:</strong> {bottle.price}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <PublicIcon sx={{ verticalAlign: "middle", mr: 1, color: "#ff9800" }} />
                            <strong>Region:</strong> {bottle.region}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <RestaurantIcon sx={{ verticalAlign: "middle", mr: 1, color: "#3f51b5" }} />
                            <strong>Food Pairings:</strong> {bottle.foodPairings}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <PercentIcon sx={{ verticalAlign: "middle", mr: 1, color: "#f44336" }} />
                            <strong>Alcohol Content:</strong> {bottle.alcoholContent}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Description */}
                <Box sx={{ mt: 3, p: 2, borderRadius: "10px", backgroundColor: "#f5f5f5" }}>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#333" }}>
                        <InfoIcon sx={{ verticalAlign: "middle", mr: 1, color: "#757575" }} />
                        {bottle.fullDescription}
                    </Typography>
                </Box>
            </CardContent>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/homepage')}
                sx={{ mb: 3, ml: 2 }}
            >
                Go to Homepage
            </Button>

        </Card>
    );
};

export default Bottle;