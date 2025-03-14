import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Box, List, ListItem, Typography, Card, CardContent, CircularProgress, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Search, FilterList } from "@mui/icons-material"; // Material Icons
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js"

const Homepage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [wineTypes, setWineTypes] = useState([]);
    const [grapeTypes, setGrapeTypes] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedWineType, setSelectedWineType] = useState("");
    const [selectedGrapeType, setSelectedGrapeType] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        console.log("user", user)
        fetchCountries();
        fetchWineTypes();
        fetchGrapeTypes();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get('http://localhost:5002/region');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchWineTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5002/winetype');
            setWineTypes(response.data);
        } catch (error) {
            console.error('Error fetching wine types:', error);
        }
    };

    const fetchGrapeTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5002/grapetype');
            setGrapeTypes(response.data);
        } catch (error) {
            console.error('Error fetching grape types:', error);
        }
    };

    const fetchBottles = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5002/bottle/search`, {
                params: {
                    q: query,
                    country: selectedCountry,
                    winetype: selectedWineType,
                    grapetype: selectedGrapeType
                }
            });
            setSearchResults(response.data.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
        setLoading(false);
    };

    const debouncedSearch = debounce((query) => {
        fetchBottles(query);
    }, 300);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchText(value);
        debouncedSearch(value);
    };
    const updateBottleView = async (bottleid) => {
        try {
            const userId = user?._id; // Replace with actual logged-in user ID
            await axios.post("http://localhost:5002/bottleView/", { bottleId: bottleid, userId });
            console.log("Bottle view updated successfully.");

        } catch (error) {
            console.error("Error updating bottle view:", error);
        }
    }
    const handlebottle = async (bottleid) => {
        updateBottleView(bottleid);
        navigate(`/bottle/${bottleid}`)

    }



    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3, textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: "8px", boxShadow: 3 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>Wine Search</Typography>

            {/* Search Bar */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for a wine..."
                value={searchText}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: <Search sx={{ color: "gray", mr: 1 }} />
                }}
                sx={{ backgroundColor: "#fff", borderRadius: "8px", mb: 2 }}
            />

            {/* Filter Section */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                    <FilterList sx={{ mr: 1 }} /> Filters
                </Typography>

                {/* Country Filter */}
                <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country._id} value={country.country}>{country.country}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Wine Type Filter */}
                <FormControl fullWidth>
                    <InputLabel>Wine Type</InputLabel>
                    <Select value={selectedWineType} onChange={(e) => setSelectedWineType(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {wineTypes.map((wine) => (
                            <MenuItem key={wine._id} value={wine.name}>{wine.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Grape Type Filter */}
                <FormControl fullWidth>
                    <InputLabel>Grape Type</InputLabel>
                    <Select value={selectedGrapeType} onChange={(e) => setSelectedGrapeType(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {grapeTypes.map((grape) => (
                            <MenuItem key={grape._id} value={grape.name}>{grape.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
            >
                Go to Dashboard
            </Button>

            {/* Show loading spinner */}
            {loading && <CircularProgress sx={{ mt: 2 }} />}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <List sx={{ mt: 2 }}>
                    {searchResults.map((bottle) => (
                        <ListItem key={bottle._id} sx={{ justifyContent: "center", cursor: "pointer" }} onClick={() => handlebottle(bottle._id)}>
                            <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: "10px", backgroundColor: "#fff" }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{bottle.name}</Typography>
                                    <Typography variant="body2" sx={{ color: "gray" }}>{bottle.winery}</Typography>
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default Homepage;