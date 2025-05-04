// src/components/CSVUpload.js
import React, { useState } from 'react';
import { Button, Stack } from '@mui/material';
import axios from 'axios';

const CSVUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a CSV file first.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post('http://localhost:5002/bottles/upload-csv', formData);
            alert('CSV uploaded successfully!');
        } catch (error) {
            console.error('Error uploading CSV:', error);
            alert('Failed to upload CSV.');
        }
    };

    return (
        <Stack spacing={2}>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <Button variant="contained" color="secondary" onClick={handleUpload}>
                Upload CSV
            </Button>
        </Stack>
    );
};

export default CSVUpload;