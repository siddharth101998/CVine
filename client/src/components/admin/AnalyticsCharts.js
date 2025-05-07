import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, Stack } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import BottleTable from './BottleTable';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    '#f1c40f', '#e67e22', '#e74c3c', '#2ecc71',
    '#3498db', '#9b59b6', '#8e44ad', '#1abc9c',
    '#2c3e50', '#7f8c8d'
];

const AnalyticsCharts = () => {
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const viewResponse = await axios.get('http://localhost:5002/bottle/top');
            const bottles = viewResponse.data.data;
            const labels = bottles.map(item => item?.name || 'Unknown');
            const data = bottles.map(item => item?.viewCount || 0);

            setViewData({
                labels,
                datasets: [{
                    label: 'Views',
                    data,
                    backgroundColor: COLORS.slice(0, labels.length),
                    borderWidth: 1,
                }],
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Top Bottles by Views
            </Typography>

            {viewData ? (
                <>
                    <Grid container spacing={2} >
                        {/* Labels Column */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                {viewData.labels.map((label, index) => (
                                    <Box key={index} display="flex" alignItems="center">
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: COLORS[index % COLORS.length],
                                                borderRadius: '50%',
                                                mr: 1.5,
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontSize: 25 }} >{label}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Chart Column */}
                        <Grid item xs={12} md={6} sx={{ mb: 10 }}>
                            <Pie
                                data={viewData}
                                options={{
                                    plugins: {
                                        legend: { display: false }, // remove legend near pie
                                        tooltip: { enabled: true }, // keep hover tooltip
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <BottleTable />
                </>
            ) : (
                <Typography>Loading view data...</Typography>
            )}
        </>
    );
};

export default AnalyticsCharts;