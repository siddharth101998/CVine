import React, { useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Box,
} from '@mui/material';
import { AccountCircle, EmojiEvents, Restaurant, Login } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
const UserProfile = () => {
    const { user } = useAuth()
    const Sampleuser = {
        username: user.username,
        email: user.email,
        loggedInCount: user.loggedInCount,
        recipeCount: user.recipeCount,
        userType: user.userType,
        badges: user.badges,
    };
    const fetchuser = async () => {
        try {
            console.log('userauth', user);
            const response = await axios.get(`http://localhost:5002/user/${user?._id}`);
            console.log("user", response.data);

        } catch (error) {
            console.error('Error fetching wine types:', error);
        }
    };
    useEffect(() => {
        fetchuser();
    }, [])

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
            <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar sx={{ bgcolor: '#1976d2', width: 60, height: 60 }}>
                                <AccountCircle fontSize="large" />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5" fontWeight="bold">
                                {Sampleuser.username}
                            </Typography>
                            <Typography color="text.secondary">{Sampleuser.email}</Typography>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            Account Info
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Chip icon={<Login />} label={`Logins: ${Sampleuser.loggedInCount}`} color="primary" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<Restaurant />} label={`Recipes: ${Sampleuser.recipeCount}`} color="secondary" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip label={`Sampleuser Type: ${Sampleuser.userType}`} variant="outlined" />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mt={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            Badges
                        </Typography>
                        {Sampleuser.badges && Sampleuser.badges.length ? (
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {Sampleuser.badges.map((badge, index) => (
                                    <Chip
                                        key={index}
                                        icon={<EmojiEvents />}
                                        label={`Badge #${badge}`}
                                        color="success"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">No badges yet.</Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserProfile;