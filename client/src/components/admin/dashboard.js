import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // For navigation
import { Button } from "@mui/material"; // For Material-UI buttons
import axios from 'axios';

const Dashboard = () => {
    const [countries, setCountries] = useState([]);
    const [wineTypes, setWineTypes] = useState([]);
    const [grapeTypes, setGrapeTypes] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedWineType, setSelectedWineType] = useState('');
    const [selectedGrapeType, setSelectedGrapeType] = useState('');
    const [newCountry, setNewCountry] = useState('');
    const [newWineType, setNewWineType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
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
            console.log("winetype", response.data);
            setWineTypes(response.data);
        } catch (error) {
            console.error('Error fetching wine types:', error);
        }
    };

    const fetchGrapeTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5002/grapetype');
            console.log("grapetype", response.data);
            setGrapeTypes(response.data);
        } catch (error) {
            console.error('Error fetching grape types:', error);
        }
    };

    const addNewCountry = async () => {
        if (!newCountry.trim()) return;
        try {
            console.log("country selected", newCountry);
            await axios.post('http://localhost:5002/region', { country: newCountry, region: "" });
            fetchCountries();
            setNewCountry('');
        } catch (error) {
            console.error('Error adding country:', error);
        }
    };

    const addNewWineType = async () => {
        if (!newWineType.trim()) return;
        try {
            await axios.post('http://localhost:5002/winetype', { name: newWineType, description: `Auto-added wine type: ${newWineType}` });
            fetchWineTypes();
            setNewWineType('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Error adding wine type:', error.response.data.message);
                alert(`Error: ${error.response.data.message}`);
            } else {
                console.error('Error adding wine type:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard</h2>

            {/* Country Section */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Country</h3>
                <label>Select Country:</label>
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
                    <option value="">Select</option>
                    {countries.map((country) => (
                        <option key={country._id} value={country.country}>{country.country}</option>
                    ))}
                </select>

                <input type="text" placeholder="New Country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <button onClick={addNewCountry} style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Add Country
                </button>
            </div>

            {/* Wine Type Section */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Wine Type</h3>
                <label>Select Wine Type:</label>
                <select value={selectedWineType} onChange={(e) => setSelectedWineType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
                    <option value="">Select</option>
                    {wineTypes.map((wine) => (
                        <option key={wine._id} value={wine.name}>{wine.name}</option>
                    ))}
                </select>

                <input type="text" placeholder="New Wine Type" value={newWineType} onChange={(e) => setNewWineType(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <button onClick={addNewWineType} style={{ width: '100%', padding: '10px', backgroundColor: '#28A745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Add Wine Type
                </button>
            </div>

            {/* Grape Type Section */}
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Grape Type</h3>
                <label>Select Grape Type:</label>
                <select value={selectedGrapeType} onChange={(e) => setSelectedGrapeType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                    <option value="">Select</option>
                    {grapeTypes.map((grape) => (
                        <option key={grape._id} value={grape.name}>{grape.name}</option>
                    ))}
                </select>
            </div>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/homepage')}
                sx={{ mb: 3, ml: 2 }}
            >
                Go to Homepage
            </Button>

        </div>
    );
};

export default Dashboard;