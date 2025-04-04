import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TextField, Box, List, ListItem, Typography, 
  CircularProgress, Button, FormControl, InputLabel, Select, MenuItem, 
  Container 
} from "@mui/material";
import { Search, FilterList, Public, WineBar, Agriculture } from "@mui/icons-material";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

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
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("user", user);
    fetchCountries();
    fetchWineTypes();
    fetchGrapeTypes();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:5002/region");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchWineTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5002/winetype");
      setWineTypes(response.data);
    } catch (error) {
      console.error("Error fetching wine types:", error);
    }
  };

  const fetchGrapeTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5002/grapetype");
      setGrapeTypes(response.data);
    } catch (error) {
      console.error("Error fetching grape types:", error);
    }
  };

  const fetchBottles = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5002/bottle/search", {
        params: {
          q: query,
          country: selectedCountry,
          winetype: selectedWineType,
          grapetype: selectedGrapeType,
        },
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

  const updateBottleView = async (bottleId) => {
    try {
      const userId = user?._id;
      await axios.post("http://localhost:5002/bottleView/", { bottleId, userId });
      console.log("Bottle view updated successfully.");
    } catch (error) {
      console.error("Error updating bottle view:", error);
    }
  };

  const handlebottle = async (bottleId) => {
    updateBottleView(bottleId);
    navigate(`/bottle/${bottleId}`);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: "#d8cdda",
        minHeight: "100vh",
        py: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          p: 2,
          display: "flex",
          gap: 3,
        }}
      >
        {/* Search & Results Column */}
        <Box sx={{ width: "500px" }}>
          <TextField
            variant="outlined"
            placeholder="Search for a wine..."
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search sx={{ color: "gray", mr: 1 }} />,
            }}
            sx={{ 
              width: "100%", 
              backgroundColor: "#fff", 
              borderRadius: "10px", 
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", 
              mb: 2 
            }}
          />

          {loading && <CircularProgress sx={{ mt: 2 }} />}

          {searchResults.length > 0 && (
            <Box
              sx={{
                width: "100%",
                maxHeight: "180px",
                overflowY: "auto",
                mt: 2,
              }}
            >
              <List>
                {searchResults.slice(0, 3).map((bottle) => (
                  <ListItem
                    key={bottle._id}
                    sx={{ justifyContent: "center", cursor: "pointer", p: 1 }}
                    onClick={() => handlebottle(bottle._id)}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        p: 1,
                        borderRadius: "4px",
                        backgroundColor: "#f2f2f2",
                        overflow:"hidden",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {bottle.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {bottle.winery}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Filters Column */}
        <Box sx={{ width: "300px", textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterList sx={{ mr: 1 }} /> Filters
          </Typography>
          {showFilters && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="country-label">
                  <Public />
                </InputLabel>
                <Select
                  labelId="country-label"
                  id="country-select"
                  value={selectedCountry}
                  label=""
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country.country}>
                      {country.country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="wine-label">
                  <WineBar />
                </InputLabel>
                <Select
                  labelId="wine-label"
                  id="wine-select"
                  value={selectedWineType}
                  label=""
                  onChange={(e) => setSelectedWineType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {wineTypes.map((wine) => (
                    <MenuItem key={wine._id} value={wine.name}>
                      {wine.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="grape-label">
                  <Agriculture />
                </InputLabel>
                <Select
                  labelId="grape-label"
                  id="grape-select"
                  value={selectedGrapeType}
                  label=""
                  onChange={(e) => setSelectedGrapeType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {grapeTypes.map((grape) => (
                    <MenuItem key={grape._id} value={grape.name}>
                      {grape.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Homepage;
