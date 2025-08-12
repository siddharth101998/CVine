// src/components/BottleTable.js
import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

const BottleTable = () => {
    const [bottles, setBottles] = useState([]);

    useEffect(() => {
        fetchBottles();
    }, []);

    const fetchBottles = async () => {
        try {
            const response = await axios.get('http://localhost:5002/bottle/top');
            console.log("resdata", response.data)
            setBottles(response.data.data);
        } catch (error) {
            console.error('Error fetching bottles:', error);
        }
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Wine Type</TableCell>
                    <TableCell>Winery</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>ViewCount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {bottles?.map((bottle) => (
                    <TableRow key={bottle._id}>
                        <TableCell>{bottle.name}</TableCell>
                        <TableCell>{bottle.wineType}</TableCell>
                        <TableCell>{bottle.Winery}</TableCell>
                        <TableCell>{bottle.price}</TableCell>
                        <TableCell>{bottle.viewCount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BottleTable;