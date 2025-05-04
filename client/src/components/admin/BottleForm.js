// src/components/BottleForm.js
import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axios from 'axios';

const BottleForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        wineType: '',
        winery: '',
        price: '',
        imageUrl: '',
        country: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5002/bottles', formData);
            alert('Bottle added successfully!');
            setFormData({
                name: '',
                wineType: '',
                winery: '',
                price: '',
                imageUrl: '',
                country: '',
            });
        } catch (error) {
            console.error('Error adding bottle:', error);
            alert('Failed to add bottle.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField label="Wine Type" name="wineType" value={formData.wineType} onChange={handleChange} required />
                <TextField label="Winery" name="winery" value={formData.winery} onChange={handleChange} required />
                <TextField label="Price" name="price" value={formData.price} onChange={handleChange} required />
                <TextField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                <TextField label="Country" name="country" value={formData.country} onChange={handleChange} required />
                <Button type="submit" variant="contained" color="primary">
                    Add Bottle
                </Button>
            </Stack>
        </form>
    );
};

export default BottleForm;