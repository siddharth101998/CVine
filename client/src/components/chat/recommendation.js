import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from '@mui/material';

const WineRecommendation = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('wineRecommendations');
        if (stored) {
            try {
                setRecommendations(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored recommendations', e);
            }
        }
    }, []);

    const recommendWine = async () => {
        // Sample input: an array of 10 bottle names
        const selectedBottles = [
            "Château Lafite Rothschild 2015",
            "Opus One 2016",
            "Dominus Estate 2014",
            "Screaming Eagle Cabernet Sauvignon 2012",
            "Caymus Special Selection 2015",
            "Silver Oak Cabernet Sauvignon 2017",
            "Cakebread Cellars Chardonnay 2018",
            "Rombauer Chardonnay 2019",
            "Domaine Leflaive Puligny-Montrachet 2017",
            "Kistler Vineyards Chardonnay 2018",
            "Cakebread Cellars Sauvignon Blanc 2020",
            "Cloudy Bay Sauvignon Blanc 2020"
        ];

        if (!selectedBottles || selectedBottles.length === 0) {
            alert("Please provide at least one bottle.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5002/api/recommend", { selectedBottles });
            // Assuming your backend returns an array of recommendations (each with bottleId, bottleName, explanation, and optionally imageUrl)
            setRecommendations(res.data.recommendations);
            localStorage.setItem('wineRecommendations', JSON.stringify(res.data.recommendations));
        } catch (error) {
            console.error("Error fetching recommendation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                mt: 4,
                mb: 4,
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
            }}
        >
            {/* Top Section: Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={recommendWine}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Get Wine Recommendations"}
                </Button>
            </Box>

            {/* Grid of Wine Cards */}
            <Grid container spacing={4}>
                {recommendations.map((wine) => (
                    <Grid item key={wine.bottleId} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 3,
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/bottle/${wine.bottleId}`)}
                        >
                            {/* Card image with a placeholder. Replace wine.imageUrl with your actual image source */}
                            <CardMedia
                                component="img"
                                height="200"
                                image={wine.imageUrl || "https://via.placeholder.com/300x200?text=Wine+Bottle"}
                                alt={wine.bottleName}
                                style={{ objectFit: 'contain' }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {wine.bottleName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {wine.explanation}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WineRecommendation;