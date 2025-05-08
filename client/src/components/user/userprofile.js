import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Avatar,
    Chip,
    Button,
    Tabs,
    Tab
} from '@mui/material';
import {
    AccountCircle,
    EmojiEvents,
    Restaurant,
    Login,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isToday, differenceInCalendarDays, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for entrance
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Animation variants for switching tab content
const tabContentVariants = {
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
    enter: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [wishlistBottles, setWishlistBottles] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('wishlist');

    // Format date strings for search history with creative text adjustments.
    const formatSearchDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        if (isToday(date)) {
            return `Today at ${format(date, 'h:mm a')}`;
        } else if (differenceInCalendarDays(now, date) === 1) {
            return 'Yesterday';
        } else if (differenceInCalendarDays(now, date) < 7) {
            const daysAgo = differenceInCalendarDays(now, date);
            return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        } else {
            return format(date, 'MMM d, yyyy');
        }
    };

    // Sample user info with fallback values.
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
            await axios.get(`http://localhost:5002/user/${user?._id}`);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5002/wishlist/${user._id}`);
            setWishlistBottles(res.data.bottles);
        } catch (error) {
            console.error("Error fetching wishlist bottles:", error);
        }
    };

    const fetchsearchhistory = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5002/searchHistory/${user._id}`);
            setSearchHistory(res.data);
        } catch (error) {
            console.error("Error fetching search history:", error);
        }
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            hasFetchedData.current = true;
            fetchuser();
            fetchWishlist();
            fetchsearchhistory();
        }
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                p: 4,
                background: 'linear-gradient(270deg, #d8cdda, #f2e1e5, #d8cdda)'
            }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Grid container spacing={4}>
                {/* Left Side: Profile Info */}
                <Grid item xs={12} md={4}>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible">
                        <Box
                            sx={{
                                backgroundColor: 'linear-gradient(100deg,rgb(170, 52, 197),rgb(218, 169, 178),rgb(45, 23, 50))',
                                p: 3,
                                height:'100vh',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Avatar sx={{ bgcolor: '#5e35b1', width: 80, height: 80 }}>
                                        <AccountCircle fontSize="large" />
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h4" fontWeight="bold">
                                        {Sampleuser.username}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {Sampleuser.email}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* User Badges */}
                            <Box mt={4}>
                                <Typography variant="h6" gutterBottom>
                                    Badges
                                </Typography>
                                {Sampleuser.badges && Sampleuser.badges.length > 0 ? (
                                    <Box display="flex" gap={1} flexWrap="wrap">
                                        {Sampleuser.badges.map((badge, index) => (
                                            <Chip
                                                key={index}
                                                icon={<EmojiEvents />}
                                                label={`Badge #${badge}`}
                                                color="success"
                                                variant="outlined"
                                                sx={{
                                                    transition: 'transform 0.3s',
                                                    '&:hover': { transform: 'scale(1.1)' },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">No badges yet.</Typography>
                                )}
                            </Box>
                        </Box>
                    </motion.div>
                </Grid>

                {/* Right Side: Wishlist and Search History */}
                <Grid item xs={12} md={8}>
                    <Box>
                        {/* Tab Navigation */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, newVal) => setActiveTab(newVal)}
                                textColor="primary"
                                indicatorColor="primary"
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Tab label="Wishlist" value="wishlist" />
                                <Tab label="Search History" value="searchHistory" />
                            </Tabs>
                        </Box>

                        {/* Animated Tab Content */}
                        <AnimatePresence exitBeforeEnter>
                            {activeTab === 'wishlist' && (
                                <motion.div
                                    key="wishlist"
                                    variants={tabContentVariants}
                                    initial="exit"
                                    animate="enter"
                                    exit="exit"
                                >
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h4" sx={{ mb: 3 }}>
                                            Your Wishlist
                                        </Typography>
                                        {wishlistBottles && wishlistBottles.length > 0 ? (
                                            wishlistBottles.map((bottle, index) => (
                                                <motion.div
                                                    key={bottle._id || index}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{ marginBottom: '16px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            backgroundColor: '#fff',
                                                            p: 2,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={bottle.imageUrl}
                                                            alt={bottle.name}
                                                            sx={{
                                                                width: 120,
                                                                height: 120,
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <Box sx={{ p: 2 }}>
                                                            <Typography variant="h6">
                                                                {bottle.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <Typography variant="body1" color="text.secondary">
                                                No bottles in your wishlist yet.
                                            </Typography>
                                        )}
                                    </Box>
                                </motion.div>
                            )}

                            {activeTab === 'searchHistory' && (
                                <motion.div
                                    key="searchHistory"
                                    variants={tabContentVariants}
                                    initial="exit"
                                    animate="enter"
                                    exit="exit"
                                >
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h4" sx={{ mb: 3 }}>
                                            Search History
                                        </Typography>
                                        {searchHistory && searchHistory.length > 0 ? (
                                            searchHistory.map((historyItem, idx) => (
                                                <motion.div
                                                    key={historyItem._id || idx}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{ marginBottom: '16px' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            borderRadius: 2,
                                                            p: 2,
                                                            backgroundColor: '#fff',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Typography variant="body2" color="text.secondary">
                                                            Searched on: {formatSearchDate(historyItem.createdat)}
                                                        </Typography>
                                                        <Box mt={2}>
                                                            {historyItem.bottles && historyItem.bottles.length > 0 ? (
                                                                historyItem.bottles.map((bottle, i) => (
                                                                    <Box
                                                                        key={bottle._id || i}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            mb: 1
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            component="img"
                                                                            src={bottle.imageUrl}
                                                                            alt={bottle.name}
                                                                            sx={{
                                                                                width: 80,
                                                                                height: 80,
                                                                                objectFit: 'cover',
                                                                                borderRadius: 2,
                                                                                mr: 2
                                                                            }}
                                                                        />
                                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                                            {bottle.name}
                                                                        </Typography>
                                                                    </Box>
                                                                ))
                                                            ) : (
                                                                <Typography variant="body1" color="text.secondary">
                                                                    No bottles in this search record.
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <Typography variant="body1" color="text.secondary">
                                                No search history found.
                                            </Typography>
                                        )}
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfile;
