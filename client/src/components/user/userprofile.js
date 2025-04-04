import React, { useEffect, useState, useRef } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Box,
    Button,
} from '@mui/material';
import { AccountCircle, EmojiEvents, Restaurant, Login, } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isToday, differenceInCalendarDays, format } from 'date-fns';

const UserProfile = () => {
    const { user } = useAuth()
    const formatSearchDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        if (isToday(date)) {
            // Show "Today at [time]" if it's today
            return `Today at ${format(date, 'h:mm a')}`;
        } else if (differenceInCalendarDays(now, date) === 1) {
            // Show "Yesterday" if it was exactly 1 day ago
            return 'Yesterday';
        } else if (differenceInCalendarDays(now, date) < 7) {
            // For dates within the past week, show "X days ago"
            const daysAgo = differenceInCalendarDays(now, date);
            return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        } else {
            // For dates older than a week, show the formatted date
            return format(date, 'MMM d, yyyy');
        }
    };
    const navigate = useNavigate();
    const [wishlistBottles, setWishlistBottles] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('wishlist');
    const Sampleuser = {
        username: user?.username || "Anonymous",
        email: user?.email,
        loggedInCount: user?.loggedInCount,
        recipeCount: user?.recipeCount,
        userType: user?.userType,
        badges: user?.badges,
    };
    const hasFetchedData = useRef(false);
    const fetchuser = async () => {
        try {
            // console.log('userauth', user);
            const response = await axios.get(`http://localhost:5002/user/${user?._id}`);
            //console.log("user", response.data);

        } catch (error) {
            console.error('Error fetching wine types:', error);
        }
    };
    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5002/wishlist/${user._id}`);
            console.log("Wishlist response:", res.data);
            setWishlistBottles(res.data.bottles); // assuming the array is under `bottles`
        } catch (error) {
            console.error("Error fetching wishlist bottles:", error);
        }
    };
    const fetchsearchhistory = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5002/searchHistory/${user._id}`);
            console.log("searchhistory response:", res.data);
            setSearchHistory(res.data);
        } catch (error) {
            console.error("Error fetching wishlist bottles:", error);
        }
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            hasFetchedData.current = true;
            fetchuser();
            fetchWishlist();
            fetchsearchhistory();
        }
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
                        {Sampleuser.badges ? (
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
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/homepage')}
                    sx={{ mb: 3, ml: 2 }}
                >
                    Go to Homepage
                </Button>
            </Card>
            {/* ------------------ TAB BUTTONS ------------------ */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                    variant={activeTab === 'wishlist' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('wishlist')}
                >
                    Wishlist
                </Button>
                <Button
                    variant={activeTab === 'searchHistory' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('searchHistory')}
                >
                    Search History
                </Button>
            </Box>

            {/* ------------------ CONDITIONAL RENDER ------------------ */}
            {activeTab === 'wishlist' && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Your Wishlist</Typography>
                    {wishlistBottles?.length > 0 ? (
                        wishlistBottles.map((bottle, index) => (
                            <Card
                                key={bottle._id || index}
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                                }}
                            >
                                <img
                                    src={bottle.imageUrl}
                                    alt={bottle.name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                        marginRight: '16px',
                                    }}
                                />
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {bottle.name}
                                </Typography>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No bottles in your wishlist yet.
                        </Typography>
                    )}
                </Box>
            )}

            {activeTab === 'searchHistory' && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Search History</Typography>
                    {/* 
                       searchHistory is an array of objects, each typically shaped like:
                       {
                         _id: 'someID',
                         userId: 'someUserID',
                         bottles: [ ... ],
                         createdat: 'someDate',
                         ...
                       }
                    */}
                    {searchHistory?.length > 0 ? (
                        searchHistory.map((historyItem, idx) => (
                            <Card
                                key={historyItem._id || idx}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Searched on:     {formatSearchDate(historyItem.createdat)}
                                </Typography>
                                <Box mt={1}>
                                    {historyItem.bottles?.length > 0 ? (
                                        historyItem.bottles.map((bottle, i) => (
                                            <Box
                                                key={bottle._id || i}
                                                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            >
                                                <img
                                                    src={bottle.imageUrl}
                                                    alt={bottle.name}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '4px',
                                                        objectFit: 'contain',
                                                        marginRight: '16px',
                                                    }}
                                                />
                                                <Typography variant="subtitle2" fontWeight="medium">
                                                    {bottle.name}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No bottles in this search record.
                                        </Typography>
                                    )}
                                </Box>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No search history found.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default UserProfile;